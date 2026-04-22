import express from "express";
import upload from "../middleware/upload.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import {
  uploadProductImage,
  deleteProductImage,
  setPrimaryProductImage,
} from "../controllers/admin-product-image.controller.js";

const router = express.Router();

router.use(requireAuth);
router.use(adminMiddleware);

router.post("/:id/images", upload.single("image"), uploadProductImage);

router.delete("/images/:imageId", deleteProductImage);

router.patch("/:id/images/:imageId/primary", setPrimaryProductImage);

export default router;