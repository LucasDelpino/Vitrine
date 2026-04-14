import pool from "../config/db.js";

export async function getAdminOrders(_req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT
        o.*,
        u.nom,
        u.prenom,
        u.email
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
    `);

    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}