import express from "express";
import {
  login,
  register,
  getMe,
  updateMe,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);

export default router;