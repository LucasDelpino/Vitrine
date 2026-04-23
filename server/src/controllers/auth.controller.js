import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { generateToken } from "../utils/jwt.js";
import { isValidEmail } from "../utils/validators.js";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

function normalizeRole(role) {
  return String(role || "user").toLowerCase().trim();
}

function mapUser(row) {
  return {
    id: row.id,
    nom: row.nom,
    prenom: row.prenom,
    email: row.email,
    role: normalizeRole(row.role),
    phone: row.phone || "",
    address: row.address || "",
    postal_code: row.postal_code || "",
    city: row.city || "",
    country: row.country || "",
  };
}

function isStrongPassword(password) {
  return PASSWORD_REGEX.test(String(password || ""));
}

export async function register(req, res) {
  try {
    const { nom, prenom, email, password, confirmPassword } = req.body;

    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({ error: "Champs requis" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Email invalide" });
    }

    if (
      confirmPassword !== undefined &&
      String(password) !== String(confirmPassword)
    ) {
      return res
        .status(400)
        .json({ error: "Les mots de passe ne correspondent pas" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        error:
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial",
      });
    }

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = "user";

    const [result] = await pool.query(
      `
      INSERT INTO users (
        nom,
        prenom,
        email,
        password,
        role
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [nom, prenom, email, hashedPassword, role]
    );

    const user = {
      id: result.insertId,
      nom,
      prenom,
      email,
      role: normalizeRole(role),
      phone: "",
      address: "",
      postal_code: "",
      city: "",
      country: "",
    };

    const token = generateToken(user);

    return res.status(201).json({
      message: "Inscription réussie",
      token,
      user,
    });
  } catch (error) {
    console.error("Erreur register :", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Champs requis" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Email invalide" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "Identifiants invalides" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Identifiants invalides" });
    }

    const safeUser = mapUser(user);
    const token = generateToken(safeUser);

    return res.json({
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("Erreur login :", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function getMe(req, res) {
  try {
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
        country
      FROM users
      WHERE id = ?
      `,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    return res.json(mapUser(rows[0]));
  } catch (error) {
    console.error("Erreur getMe :", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function updateMe(req, res) {
  try {
    const {
      nom,
      prenom,
      email,
      phone = "",
      address = "",
      postal_code = "",
      city = "",
      country = "",
    } = req.body;

    if (!nom || !prenom || !email) {
      return res.status(400).json({ error: "Champs requis" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Email invalide" });
    }

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, req.user.id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

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
        phone,
        address,
        postal_code,
        city,
        country,
        req.user.id,
      ]
    );

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
        country
      FROM users
      WHERE id = ?
      `,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    return res.json({
      message: "Profil mis à jour",
      user: mapUser(rows[0]),
    });
  } catch (error) {
    console.error("Erreur updateMe :", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}