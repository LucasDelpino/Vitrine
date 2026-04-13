import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.getCart(userId);
    res.json(cart);
  } catch (error) {
    console.error("Erreur getCart :", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    await Cart.add(userId, productId, quantity || 1);

    res.status(201).json({ message: "Produit ajouté au panier" });
  } catch (error) {
    console.error("Erreur addToCart :", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await Cart.remove(userId, productId);

    res.json({ message: "Produit supprimé du panier" });
  } catch (error) {
    console.error("Erreur removeFromCart :", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.clear(userId);

    res.json({ message: "Panier vidé" });
  } catch (error) {
    console.error("Erreur clearCart :", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};