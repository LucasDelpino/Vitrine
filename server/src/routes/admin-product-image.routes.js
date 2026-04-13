import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { uploadProductImageAdmin } from "../controllers/admin-product-image.controller.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.post("/products/:id/images", upload.single("image"), uploadProductImageAdmin);

export default router;