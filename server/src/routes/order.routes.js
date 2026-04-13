import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createOrder,
  getMyOrders,
  getOrderItems,
  getOrderById
} from "../controllers/order.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createOrder);
router.get("/", getMyOrders);
router.get("/:orderId", getOrderById);
router.get("/:orderId/items", getOrderItems);

export default router;