import Order from "../models/Order.js";
import User from "../models/User.js";
import { sendOrderShippedEmail } from "../services/mail.service.js";

const ALLOWED_STATUSES = [
  "pending",
  "paid",
  "shipped",
  "cancelled"
];

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.getAllAdmin();
    res.json(orders);
  } catch (error) {
    console.error("Erreur getAllOrdersAdmin :", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ error: "Statut invalide" });
    }

    await Order.updateStatus(id, status);

    if (status === "shipped") {
      const order = await Order.getOneAdmin(id);

      if (order) {
        const user = await User.findById(order.user_id);
        const items = await Order.getItems(order.id, order.user_id);

        if (user?.email) {
          const previewUrl = await sendOrderShippedEmail({
            to: user.email,
            order,
            items
          });

          console.log("Aperçu email expédition Ethereal :", previewUrl);
        }
      }
    }

    res.json({ message: "Statut mis à jour" });
  } catch (error) {
    console.error("Erreur updateOrderStatusAdmin :", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};