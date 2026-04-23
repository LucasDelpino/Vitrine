import express from "express";
import cors from "cors";
import helmet from "helmet";
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

const allowedOrigins = String(env.clientUrl || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");

if (env.nodeEnv === "production") {
  app.set("trust proxy", 1);
}

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origine non autorisée par CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Stripe webhook must receive the raw body before express.json()
app.use("/api/stripe/webhook", stripeWebhookRoutes);

app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true, limit: "200kb" }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../public/uploads"), {
    index: false,
    maxAge: env.nodeEnv === "production" ? "7d" : 0,
  })
);

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
  console.error("Erreur serveur :", err);

  if (err?.message === "Origine non autorisée par CORS") {
    return res.status(403).json({ error: "Accès interdit" });
  }

  if (err?.name === "MulterError") {
    return res.status(400).json({ error: "Fichier invalide" });
  }

  if (err?.message === "Format image non autorisé") {
    return res.status(400).json({ error: err.message });
  }

  return res.status(err.status || 500).json({
    error: err.status && err.status < 500 ? err.message : "Erreur serveur",
  });
});

app.listen(env.port, () => {
  console.log(`API running on port ${env.port}`);
});