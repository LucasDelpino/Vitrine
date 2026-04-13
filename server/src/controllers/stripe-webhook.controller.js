import Stripe from "stripe";
import pool from "../config/db.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import { sendOrderPaidEmail } from "../services/mail.service.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Erreur webhook Stripe :", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const orderId = session.metadata?.order_id;
      const userId = session.metadata?.user_id;

      if (orderId) {
        await pool.query(
          `
          UPDATE orders
          SET
            payment_status = 'paid',
            status = 'paid',
            stripe_payment_intent_id = ?,
            paid_at = NOW()
          WHERE id = ?
          `,
          [session.payment_intent || null, orderId]
        );

        const user = await User.findByIdWithEmail(userId);
        const order = await Order.getOne(orderId, userId);
        const items = await Order.getItems(orderId, userId);

        if (user?.email && order) {
          const previewUrl = await sendOrderPaidEmail({
            to: user.email,
            order,
            items
          });

          console.log("Aperçu email Ethereal :", previewUrl);
        }
      }
    }

    return res.json({ received: true });
  } catch (error) {
    console.error("Erreur traitement webhook :", error.message);
    return res.status(500).json({ error: "Erreur serveur webhook" });
  }
};