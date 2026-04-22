import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";

import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js";
import stripeRoutes from "./routes/stripe.routes.js";
import stripeWebhookRoutes from "./routes/stripe-webhook.routes.js";
import adminRoutes from "./routes/admin-routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

// Stripe webhook must receive the raw body before express.json()
app.use("/api/stripe/webhook", stripeWebhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, environment: env.nodeEnv });
});

if (env.nodeEnv === "development") {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route introuvable" });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Erreur serveur",
  });
});

app.listen(env.port, () => {
  console.log(`API running on port ${env.port}`);
});