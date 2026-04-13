import Stripe from "stripe";
import Order from "../models/Order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "orderId requis" });
    }

    const order = await Order.getOne(orderId, userId);

    if (!order) {
      return res.status(404).json({ error: "Commande introuvable" });
    }

    if (order.payment_status === "paid") {
      return res.status(400).json({ error: "Commande déjà payée" });
    }

    const items = await Order.getItems(orderId, userId);

    if (!items.length) {
      return res.status(400).json({ error: "Commande vide" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: String(order.id),
      metadata: {
        order_id: String(order.id),
        user_id: String(userId)
      },
      line_items: items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "eur",
          product_data: {
            name: item.product_name,
            images: item.product_image
              ? [`http://localhost:3000/uploads/${item.product_image}`]
              : []
          },
          unit_amount: Math.round(Number(item.unit_price) * 100)
        }
      })),
      success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/orders/${order.id}`,
    });

    await Order.setStripeSession(order.id, session.id);

    res.json({ url: session.url });
  } catch (error) {
    console.error("Erreur createCheckoutSession :", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};