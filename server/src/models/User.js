import pool from "../config/db.js";

class User {
  static async findByEmail(email) {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        nom,
        prenom,
        email,
        role,
        phone,
        address,
        postal_code,
        city,
        country,
        created_at
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    return rows[0] || null;
  }

  static async create({ nom, prenom, email, password, role = "user" }) {
    const [result] = await pool.query(
      `
      INSERT INTO users (nom, prenom, email, password, role)
      VALUES (?, ?, ?, ?, ?)
      `,
      [nom, prenom, email, password, role]
    );

    return result.insertId;
  }

  static async updateProfile(
    id,
    { nom, prenom, email, phone, address, postal_code, city, country }
  ) {
    await pool.query(
      `
      UPDATE users
      SET
        nom = ?,
        prenom = ?,
        email = ?,
        phone = ?,
        address = ?,
        postal_code = ?,
        city = ?,
        country = ?
      WHERE id = ?
      `,
      [
        nom,
        prenom,
        email,
        phone || null,
        address || null,
        postal_code || null,
        city || null,
        country || null,
        id,
      ]
    );

    return this.findById(id);
  }
}

export default User;