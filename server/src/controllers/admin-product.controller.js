import Product from "../models/Product.js";

export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.getAllAdmin();
    res.json(products);
  } catch (error) {
    console.error("Erreur getAllProductsAdmin :", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const createProductAdmin = async (req, res) => {
  try {
    const {
      name,
      slug,
      sku,
      short_description,
      description,
      price,
      stock,
      is_active
    } = req.body;

    if (!name || !description || price === undefined || stock === undefined) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    const productId = await Product.create({
      name,
      slug,
      sku,
      short_description,
      description,
      price,
      stock,
      is_active
    });

    const product = await Product.getById(productId);

    res.status(201).json({
      message: "Produit créé",
      product
    });
  } catch (error) {
    console.error("Erreur createProductAdmin :", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateProductAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.update(id, req.body);

    const product = await Product.getById(id);

    res.json({
      message: "Produit mis à jour",
      product
    });
  } catch (error) {
    console.error("Erreur updateProductAdmin :", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const deleteProductAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.delete(id);

    res.json({ message: "Produit supprimé" });
  } catch (error) {
    console.error("Erreur deleteProductAdmin :", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};