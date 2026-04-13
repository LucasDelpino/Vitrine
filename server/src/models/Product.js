import pool from "../config/db.js";

class Product {
  static buildImageUrl(filename) {
    return `http://localhost:3000/uploads/${filename || "default.jpg"}`;
  }

  static async getImages(productId) {
    const [rows] = await pool.query(
      "SELECT * FROM product_images WHERE product_id = ?",
      [productId]
    );

    return rows.map((row) => ({
      ...row,
      image_url: this.buildImageUrl(row.image)
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
              : this.buildImageUrl("default.jpg")
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
          : this.buildImageUrl("default.jpg")
    };
  }

  static async getAllAdmin() {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM products
      ORDER BY created_at DESC
      `
    );

    return rows;
  }

  static async create({
    name,
    slug,
    sku,
    short_description,
    description,
    price,
    stock,
    is_active
  }) {
    const [result] = await pool.query(
      `
      INSERT INTO products (
        name,
        slug,
        sku,
        short_description,
        description,
        price,
        stock,
        is_active
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
        is_active ? 1 : 0
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
        id
      ]
    );
  }

  static async delete(id) {
    await pool.query("DELETE FROM products WHERE id = ?", [id]);
  }

  static async addImage(productId, imageName) {
    const [result] = await pool.query(
      `
      INSERT INTO product_images (product_id, image)
      VALUES (?, ?)
      `,
      [productId, imageName]
    );

    return result.insertId;
  }

  static async deleteImage(imageId) {
    await pool.query("DELETE FROM product_images WHERE id = ?", [imageId]);
  }
}

export default Product;