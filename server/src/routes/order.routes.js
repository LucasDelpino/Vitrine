import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrderItems,
} from "../controllers/order.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getMyOrders);
router.post("/", createOrder);
router.get("/:orderId", getOrderById);
router.get("/:orderId/items", getOrderItems);

export default router;