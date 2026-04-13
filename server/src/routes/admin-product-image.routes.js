import express from "express";
import upload from "../middleware/upload.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import {
  uploadProductImage,
  deleteProductImage,
  setPrimaryProductImage,
} from "../controllers/admin-product-image.controller.js";

const router = express.Router();

router.post(
  "/:id/images",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  uploadProductImage
);

router.delete(
  "/images/:imageId",
  authMiddleware,
  adminMiddleware,
  deleteProductImage
);

router.patch(
  "/:id/images/:imageId/primary",
  authMiddleware,
  adminMiddleware,
  setPrimaryProductImage
);

export default router;