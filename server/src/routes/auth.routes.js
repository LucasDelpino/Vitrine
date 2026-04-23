import express from "express";
import {
  register,
  login,
  getMe,
  updateMe,
  forgotPassword,
  resetPassword
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, updateMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;