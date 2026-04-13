import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import {
  getAllProductsAdmin,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin
} from "../controllers/admin-product.controller.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/products", getAllProductsAdmin);
router.post("/products", createProductAdmin);
router.put("/products/:id", updateProductAdmin);
router.delete("/products/:id", deleteProductAdmin);

export default router;