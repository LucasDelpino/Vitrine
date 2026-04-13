import Product from "../models/Product.js";

export const uploadProductImageAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("UPLOAD product id =", id);
    console.log("UPLOAD file =", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier envoyé" });
    }

    const imageId = await Product.addImage(id, req.file.filename);
    console.log("IMAGE INSERT ID =", imageId);

    const product = await Product.getById(id);
    console.log("PRODUCT AFTER IMAGE =", product);

    res.status(201).json({
      message: "Image ajoutée",
      product
    });
  } catch (error) {
    console.error("Erreur uploadProductImageAdmin :", error);
    res.status(500).json({
      error: "Erreur serveur",
      details: error.message
    });
  }
};