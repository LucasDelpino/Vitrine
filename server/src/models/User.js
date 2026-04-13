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
      SELECT id, nom, prenom, email, roles, created_at
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    return rows[0] || null;
  }

  static async create({ nom, prenom, email, password, roles = "user" }) {
    const [result] = await pool.query(
      `
      INSERT INTO users (nom, prenom, email, password, roles)
      VALUES (?, ?, ?, ?, ?)
      `,
      [nom, prenom, email, password, roles]
    );

    return result.insertId;
  }

  static async updateProfile(id, { nom, prenom, email }) {
    console.log("User.updateProfile id =", id);
    console.log("User.updateProfile payload =", { nom, prenom, email });

    const [result] = await pool.query(
      `
      UPDATE users
      SET nom = ?, prenom = ?, email = ?
      WHERE id = ?
      `,
      [nom, prenom, email, id]
    );

    console.log("User.updateProfile result =", result);

    return this.findById(id);
  }
}

export default User;