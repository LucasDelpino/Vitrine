import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import {
  getAllOrdersAdmin,
  updateOrderStatusAdmin
} from "../controllers/admin-order.controller.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/orders", getAllOrdersAdmin);
router.patch("/orders/:id/status", updateOrderStatusAdmin);

export default router;