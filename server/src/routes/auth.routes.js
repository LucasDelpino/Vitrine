import express from "express";
import rateLimit from "express-rate-limit";
import {
  register,
  login,
  getMe,
  updateMe,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de requêtes, réessayez plus tard." },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de tentatives. Réessayez plus tard." },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de créations de compte. Réessayez plus tard." },
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Trop de demandes de réinitialisation. Réessayez plus tard.",
  },
});

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.get("/me", requireAuth, getMe);
router.put("/me", authLimiter, requireAuth, updateMe);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);

export default router;