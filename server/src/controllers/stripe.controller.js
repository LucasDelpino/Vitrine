import Stripe from "stripe";
import { env } from "../config/env.js";
import Order from "../models/Order.js";

const stripe = new Stripe(env.stripe.secretKey);

export async function createCheckoutSession(req, res) {
  try {
    const { items, orderId } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Panier invalide" });
    }

    const normalizedItems = items.map((item) => {
      const quantity = Number.parseInt(item.quantity, 10);

      if (
        !item ||
        typeof item !== "object" ||
        !item.price_data ||
        !item.price_data.currency ||
        !item.price_data.product_data?.name ||
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        throw new Error("Ligne de paiement invalide");
      }

      return {
        price_data: item.price_data,
        quantity,
      };
    });

    const metadata = {
      user_id: String(userId),
    };

    if (orderId) {
      metadata.order_id = String(orderId);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: normalizedItems,
      mode: "payment",
      success_url: `${env.clientUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.clientUrl}/cart`,
      metadata,
    });

    if (orderId) {
      await Order.setStripeSession(orderId, session.id);
    }

    return res.json({ url: session.url });
  } catch (error) {
    console.error("Erreur Stripe :", error.message);
    return res.status(500).json({
      error:
        error.message === "Ligne de paiement invalide"
          ? error.message
          : "Erreur Stripe",
    });
  }
}