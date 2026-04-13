import express from "express";
import upload from "../middleware/upload.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import { uploadProductImage } from "../controllers/admin-product-image.controller.js";

const router = express.Router();

router.post(
  "/:id/images",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  uploadProductImage
);

export default router;