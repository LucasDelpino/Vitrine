import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingMethod } = req.body;

    const order = await Order.createFromCart(userId, { shippingMethod });

    res.status(201).json({
      message: "Commande créée avec succès",
      order,
    });
  } catch (error) {
    console.error("Erreur createOrder :", error.message);

    if (
      error.message === "Panier vide" ||
      error.message === "Mode de livraison invalide" ||
      error.message.startsWith("Stock insuffisant")
    ) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.getByUser(userId);
    res.json(orders);
  } catch (error) {
    console.error("Erreur getMyOrders :", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getOrderItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const items = await Order.getItems(orderId, userId);
    res.json(items);
  } catch (error) {
    console.error("Erreur getOrderItems :", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await Order.getOne(orderId, userId);

    if (!order) {
      return res.status(404).json({ error: "Commande introuvable" });
    }

    res.json(order);
  } catch (error) {
    console.error("Erreur getOrderById :", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};