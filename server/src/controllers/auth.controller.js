import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { generateToken } from "../utils/jwt.js";
import { isValidEmail } from "../utils/validators.js";
import crypto from "crypto";
import {
  sendResetPasswordEmail,
  sendWelcomeEmail,
} from "../services/mail.service.js";

const loginAttempts = {};
const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 15 * 60 * 1000;

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

function getClientKey(req, email = "") {
  return `${req.ip}::${String(email).toLowerCase().trim()}`;
}

function isBlocked(key) {
  const entry = loginAttempts[key];

  if (!entry) {
    return false;
  }

  if (entry.attempts < MAX_ATTEMPTS) {
    return false;
  }

  const diff = Date.now() - entry.lastAttempt;
  if (diff < BLOCK_TIME) {
    return true;
  }

  delete loginAttempts[key];
  return false;
}

function registerFailedAttempt(key) {
  if (!loginAttempts[key]) {
    loginAttempts[key] = { attempts: 0, lastAttempt: Date.now() };
  }

  loginAttempts[key].attempts += 1;
  loginAttempts[key].lastAttempt = Date.now();
}

function clearAttempts(key) {
  delete loginAttempts[key];
}

export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: "Données manquantes" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        error:
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const [rows] = await pool.query(
      `
      SELECT *
      FROM users
      WHERE reset_password_token = ?
      AND reset_password_expires > NOW()
      `,
      [hashedToken]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "Token invalide ou expiré" });
    }

    const user = rows[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `
      UPDATE users
      SET
        password = ?,
        reset_password_token = NULL,
        reset_password_expires = NULL
      WHERE id = ?
      `,
      [hashedPassword, user.id]
    );

    return res.json({ message: "Mot de passe réinitialisé" });
  } catch (error) {
    console.error("Erreur resetPassword :", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email requis" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Email invalide" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.json({
        message: "Si le compte existe, un email a été envoyé",
      });
    }

    const user = rows[0];
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await pool.query(
      `
      UPDATE users
      SET
        reset_password_token = ?,
        reset_password_expires = ?
      WHERE id = ?
      `,
      [hashedToken, expires, user.id]
    );

    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;
    const previewUrl = await sendResetPasswordEmail({
      to: user.email,
      resetUrl,
    });

    console.log("Lien reset envoyé :", previewUrl);

    return res.json({
      message: "Si le compte existe, un email a été envoyé",
    });
  } catch (error) {
    console.error("Erreur forgotPassword :", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
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

    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (existing.length > 0) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
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

    const previewUrl = await sendWelcomeEmail({
      to: email,
      prenom,
    });

    console.log("Aperçu email bienvenue :", previewUrl);

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

    const key = getClientKey(req, email);

    if (isBlocked(key)) {
      return res.status(429).json({
        error: "Trop de tentatives. Réessayez plus tard.",
      });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      registerFailedAttempt(key);
      return res.status(400).json({ error: "Identifiants invalides" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      registerFailedAttempt(key);
      return res.status(400).json({ error: "Identifiants invalides" });
    }

    clearAttempts(key);

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