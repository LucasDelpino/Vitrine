import pool from "../config/db.js";

class Product {
  static buildImageUrl(filename) {
    return `http://localhost:3000/uploads/${filename || "default.jpg"}`;
  }

  static async getImages(productId) {
    const [rows] = await pool.query(
      "SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC",
      [productId]
    );

    return rows.map((row) => ({
      ...row,
      image_url: this.buildImageUrl(row.image),
    }));
  }

  static async getAll() {
    const [products] = await pool.query(
      "SELECT * FROM products ORDER BY id DESC"
    );

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await this.getImages(product.id);

        return {
          ...product,
          images,
          image_url:
            images.length > 0
              ? images[0].image_url
              : this.buildImageUrl("default.jpg"),
        };
      })
    );

    return productsWithImages;
  }

  static async getById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (!rows[0]) return null;

    const product = rows[0];
    const images = await this.getImages(product.id);

    return {
      ...product,
      images,
      image_url:
        images.length > 0
          ? images[0].image_url
          : this.buildImageUrl("default.jpg"),
    };
  }

  static async getAllAdmin() {
    const [products] = await pool.query(
      "SELECT * FROM products ORDER BY created_at DESC"
    );

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await this.getImages(product.id);

        return {
          ...product,
          images,
          image_url:
            images.length > 0
              ? images[0].image_url
              : this.buildImageUrl("default.jpg"),
        };
      })
    );

    return productsWithImages;
  }

  static async create({
    name,
    slug,
    sku,
    short_description,
    description,
    price,
    stock,
    is_active,
  }) {
    const [result] = await pool.query(
      `
      INSERT INTO products (
        name, slug, sku, short_description, description, price, stock, is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        slug || null,
        sku || null,
        short_description || null,
        description,
        price,
        stock,
        is_active ? 1 : 0,
      ]
    );

    return result.insertId;
  }

  static async update(id, data) {
    await pool.query(
      `
      UPDATE products
      SET
        name = ?,
        slug = ?,
        sku = ?,
        short_description = ?,
        description = ?,
        price = ?,
        stock = ?,
        is_active = ?
      WHERE id = ?
      `,
      [
        data.name,
        data.slug || null,
        data.sku || null,
        data.short_description || null,
        data.description,
        data.price,
        data.stock,
        data.is_active ? 1 : 0,
        id,
      ]
    );
  }

  static async delete(id) {
    await pool.query("DELETE FROM products WHERE id = ?", [id]);
  }

  static async addImage(productId, imageName) {
    const [maxRows] = await pool.query(
      `
      SELECT COALESCE(MAX(sort_order), 0) AS maxSort FROM product_images WHERE product_id = ?
      `,
      [productId]
    );

    const nextSortOrder = Number(maxRows[0]?.maxSort || 0) + 1;

    const [insertResult] = await pool.query(
      `
      INSERT INTO product_images (product_id, image, sort_order)
      VALUES (?, ?, ?)
      `,
      [productId, imageName, nextSortOrder]
    );

    return result.insertId;
  }

  static async deleteImage(imageId) {
    await pool.query("DELETE FROM product_images WHERE id = ?", [imageId]);
  }

  static async setPrimaryImage(productId, imageId) {
    const [images] = await pool.query(
      `
      SELECT id
      FROM product_images
      WHERE product_id = ?
      ORDER BY sort_order ASC, id ASC
      `,
      [productId]
    );

    if (!images.length) {
      return;
    }

    let sortOrder = 1;

    await pool.query(
      `
      UPDATE product_images
      SET sort_order = 0
      WHERE id = ? AND product_id = ?
      `,
      [imageId, productId]
    );

    for (const image of images) {
      if (Number(image.id) === Number(imageId)) {
        continue;
      }

      await pool.query(
        `
        UPDATE product_images
        SET sort_order = ?
        WHERE id = ? AND product_id = ?
        `,
        [sortOrder, image.id, productId]
      );

      sortOrder += 1;
    }
  }
}

export default Product;