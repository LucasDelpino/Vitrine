import pool from "./config/db.js";

try {
  const [rows] = await pool.query("SELECT 1 AS test");
  console.log("Connexion MySQL OK :", rows);
  process.exit(0);
} catch (error) {
  console.error("Erreur connexion MySQL :", error.message);
  process.exit(1);
}