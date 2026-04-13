import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js";
import stripeRoutes from "./routes/stripe.routes.js";
import stripeWebhookRoutes from "./routes/stripe-webhook.routes.js";
import adminOrderRoutes from "./routes/admin-order.routes.js";
import adminProductRoutes from "./routes/admin-product.routes.js";
import adminProductImageRoutes from "./routes/admin-product-image.routes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

// IMPORTANT : webhook AVANT express.json() ET AVANT /api/stripe
app.use("/api/stripe/webhook", stripeWebhookRoutes);

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../public/uploads"))
);

app.get("/", (req, res) => {
  res.json({ message: "API Vitrine OK" });
});

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/admin", adminOrderRoutes);
app.use("/api/admin", adminProductRoutes);
app.use("/api/admin/products", adminProductImageRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});