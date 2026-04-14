import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { generateToken } from "../utils/jwt.js";
import { isValidEmail } from "../utils/validators.js";

function normalizeRole(role) {
  return String(role || "user").toLowerCase().trim();
}

export async function register(req, res) {
  try {
    const { nom, prenom, email, password } = req.body;

    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({ error: "Champs requis" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Email invalide" });
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
      "INSERT INTO users (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [nom, prenom, email, hashedPassword, role]
    );

    const user = {
      id: result.insertId,
      role: normalizeRole(role),
      nom,
      prenom,
      email,
    };

    const token = generateToken(user);

    return res.status(201).json({ token, user });
  } catch (error) {
    console.error(error);
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

    const safeUser = {
      id: user.id,
      role: normalizeRole(user.role),
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
    };

    const token = generateToken(safeUser);

    return res.json({
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function getMe(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, nom, prenom, email, role FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    const user = rows[0];

    return res.json({
      ...user,
      role: normalizeRole(user.role),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function updateMe(req, res) {
  try {
    const { nom, prenom, email } = req.body;

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
      "UPDATE users SET nom = ?, prenom = ?, email = ? WHERE id = ?",
      [nom, prenom, email, req.user.id]
    );

    const [rows] = await pool.query(
      "SELECT id, nom, prenom, email, role FROM users WHERE id = ?",
      [req.user.id]
    );

    const user = rows[0];

    return res.json({
      message: "Profil mis à jour",
      user: {
        ...user,
        role: normalizeRole(user.role),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}