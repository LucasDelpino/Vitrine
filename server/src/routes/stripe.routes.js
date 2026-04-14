import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { createCheckoutSession } from "../controllers/stripe.controller.js";

const router = express.Router();

router.post("/create-checkout-session", requireAuth, createCheckoutSession);

export default router;