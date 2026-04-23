import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

function normalizeRole(role) {
  return String(role || "").toLowerCase().trim();
}

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  try {
    const decoded = jwt.verify(token, env.jwt.secret);

    req.user = {
      id: decoded.id,
      role: normalizeRole(decoded.role),
    };

    return next();
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expirée" });
    }

    return res.status(401).json({ error: "Token invalide" });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || normalizeRole(req.user.role) !== "admin") {
    return res.status(403).json({ error: "Accès interdit" });
  }

  return next();
}