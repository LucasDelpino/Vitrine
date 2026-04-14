import Stripe from "stripe";
import { env } from "../config/env.js";

const stripe = new Stripe(env.stripe.secretKey);

export async function createCheckoutSession(req, res) {
  try {
    const { items } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items,
      mode: "payment",
      success_url: `${env.clientUrl}/checkout/success`,
      cancel_url: `${env.clientUrl}/cart`,
    });

    res.json({ url: session.url });
  } catch {
    res.status(500).json({ error: "Erreur Stripe" });
  }
}