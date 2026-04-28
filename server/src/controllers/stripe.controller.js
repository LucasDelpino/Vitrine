import Stripe from "stripe";
import { env } from "../config/env.js";
import Order from "../models/Order.js";

const stripe = new Stripe(env.stripe.secretKey);

function formatStripeAmount(value) {
  return Math.round(Number(value) * 100);
}

export async function createCheckoutSession(req, res) {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    if (!orderId) {
      return res.status(400).json({ error: "Commande manquante" });
    }

    const order = await Order.getOne(orderId, userId);

    if (!order) {
      return res.status(404).json({ error: "Commande introuvable" });
    }

    if (order.payment_status === "paid") {
      return res.status(400).json({ error: "Commande déjà payée" });
    }

    const items = await Order.getItems(order.id, userId);

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Commande vide" });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.product_name,
        },
        unit_amount: formatStripeAmount(item.unit_price),
      },
      quantity: Number(item.quantity),
    }));

    if (Number(order.shipping_amount) > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: order.shipping_label || "Livraison",
          },
          unit_amount: formatStripeAmount(order.shipping_amount),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${env.clientUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.clientUrl}/cart`,
      metadata: {
        user_id: String(userId),
        order_id: String(order.id),
      },
    });

    await Order.setStripeSession(order.id, session.id);

    return res.json({ url: session.url });
  } catch (error) {
    console.error("Erreur Stripe :", error.message);
    return res.status(500).json({ error: "Erreur Stripe" });
  }
}