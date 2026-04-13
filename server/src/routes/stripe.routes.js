import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createCheckoutSession } from "../controllers/stripe.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/checkout-session", createCheckoutSession);

export default router;