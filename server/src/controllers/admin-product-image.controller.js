import Product from "../models/Product.js";

export const uploadProductImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier envoyé" });
    }

    await Product.deleteImagesByProductId(id);
    await Product.addImage(id, req.file.filename);

    const product = await Product.getById(id);

    return res.status(201).json({
      message: "Image mise à jour",
      product,
    });
  } catch (error) {
    console.error("Erreur upload image admin :", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};