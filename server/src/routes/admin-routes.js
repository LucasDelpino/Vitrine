import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";
import { getAdminOrders } from "../controllers/admin.controller.js";
import {
  getAllProductsAdmin,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
} from "../controllers/admin-product.controller.js";
import upload from "../middleware/upload.middleware.js";
import {
  uploadProductImage,
  deleteProductImage,
  setPrimaryProductImage,
} from "../controllers/admin-product-image.controller.js";
import { updateOrderStatusAdmin } from "../controllers/admin-order.controller.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/orders", getAdminOrders);

router.get("/products", getAllProductsAdmin);
router.post("/products", createProductAdmin);
router.put("/products/:id", updateProductAdmin);
router.delete("/products/:id", deleteProductAdmin);

router.post("/products/:id/images", upload.single("image"), uploadProductImage);
router.delete("/products/images/:imageId", deleteProductImage);
router.patch("/products/:id/images/:imageId/primary", setPrimaryProductImage);
router.patch("/orders/:id/status", updateOrderStatusAdmin);

export default router;