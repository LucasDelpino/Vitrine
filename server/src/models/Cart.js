import pool from "../config/db.js";

class Cart {
  static async add(userId, productId, quantity = 1) {
    const [rows] = await pool.query(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    const item = rows[0];

    if (item) {
      await pool.query(
        "UPDATE cart SET quantity = quantity + ? WHERE id = ?",
        [quantity, item.id]
      );
    } else {
      await pool.query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [userId, productId, quantity]
      );
    }
  }

  static async remove(userId, productId) {
    await pool.query(
      "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );
  }

  static async getCart(userId) {
    const [rows] = await pool.query(
      `
      SELECT c.product_id, c.quantity, p.name, p.price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      `,
      [userId]
    );

    return rows;
  }

  static async clear(userId) {
    await pool.query(
      "DELETE FROM cart WHERE user_id = ?",
      [userId]
    );
  }
}

export default Cart;