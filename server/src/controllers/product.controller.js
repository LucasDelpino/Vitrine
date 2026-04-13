import Product from "../models/Product.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (error) {
    console.error("Erreur getAllProducts :", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.getById(id);

    if (!product) {
      return res.status(404).json({ error: "Produit introuvable" });
    }

    res.json(product);
  } catch (error) {
    console.error("Erreur getProductById :", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};