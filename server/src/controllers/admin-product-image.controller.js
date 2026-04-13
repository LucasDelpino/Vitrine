import Product from "../models/Product.js";

export const uploadProductImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier envoyé" });
    }

    await Product.addImage(id, req.file.filename);

    const product = await Product.getById(id);

    return res.status(201).json({
      message: "Image ajoutée",
      product,
    });
  } catch (error) {
    console.error("Erreur upload image admin :", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

export const deleteProductImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    await Product.deleteImage(imageId);

    return res.json({
      message: "Image supprimée",
    });
  } catch (error) {
    console.error("Erreur suppression image admin :", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

export const setPrimaryProductImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;

    await Product.setPrimaryImage(id, imageId);

    const product = await Product.getById(id);

    return res.json({
      message: "Image principale mise à jour",
      product,
    });
  } catch (error) {
    console.error("Erreur image principale admin :", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};