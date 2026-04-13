import pool from "./config/db.js";

try {
  const [rows] = await pool.query("SELECT * FROM users");
  console.log(rows);
  process.exit(0);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}