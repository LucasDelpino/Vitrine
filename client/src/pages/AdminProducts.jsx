import { useEffect, useState } from "react";
import {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "../services/adminProductApi.js";

import {
  uploadAdminProductImage,
  deleteAdminProductImage,
  setPrimaryAdminProductImage,
} from "../services/adminProductImageApi.js";

const initialForm = {
  name: "",
  slug: "",
  sku: "",
  short_description: "",
  description: "",
  price: "",
  stock: "",
  is_active: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Images sélectionnées AVANT création d'un produit
  const [createImages, setCreateImages] = useState([]);

  // Images sélectionnées pendant l'édition
  const [editImages, setEditImages] = useState([]);

  const loadProducts = async () => {
    try {
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch (err) {
      console.error("LOAD PRODUCTS ERROR =", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setCreateImages([]);
    setEditImages([]);
    setError("");
    setMessage("");
  };

  const handleCreateImagesChange = (event) => {
    const files = Array.from(event.target.files || []);
    setCreateImages(files);
  };

  const handleEditImagesChange = (event) => {
    const files = Array.from(event.target.files || []);
    setEditImages(files);
  };

  const uploadMultipleImages = async (productId, files) => {
    for (const file of files) {
      await uploadAdminProductImage(productId, file);
    }
  };

  const handleSetPrimaryImage = async (productId, imageId) => {
    try {
      setError("");
      setMessage("");

      await setPrimaryAdminProductImage(productId, imageId);

      setMessage("Image principale mise à jour");
      await loadProducts();
    } catch (err) {
      console.error("SET PRIMARY IMAGE ERROR =", err);
      setError(err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (editingId) {
        await updateAdminProduct(editingId, payload);

        if (editImages.length > 0) {
          await uploadMultipleImages(editingId, editImages);
        }

        setMessage("Produit mis à jour");
      } else {
        const createdProduct = await createAdminProduct(payload);

        // Selon ton API, l'id peut être dans createdProduct.id
        // ou dans createdProduct.product.id
        const newProductId =
          createdProduct?.id || createdProduct?.product?.id || null;

        if (!newProductId) {
          throw new Error(
            "Produit créé mais impossible de récupérer son identifiant"
          );
        }

        if (createImages.length > 0) {
          await uploadMultipleImages(newProductId, createImages);
        }

        setMessage("Produit créé");
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      console.error("SUBMIT ERROR =", err);
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setCreateImages([]);
    setEditImages([]);
    setForm({
      name: product.name || "",
      slug: product.slug || "",
      sku: product.sku || "",
      short_description: product.short_description || "",
      description: product.description || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      is_active: Boolean(product.is_active),
    });
    setMessage("");
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Supprimer ce produit ?");

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteAdminProduct(id);

      if (editingId === id) {
        resetForm();
      }

      setMessage("Produit supprimé");
      await loadProducts();
    } catch (err) {
      console.error("DELETE PRODUCT ERROR =", err);
      setError(err.message);
    }
  };

  const handleDeleteImage = async (imageId) => {
    const confirmed = window.confirm("Supprimer cette image ?");

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteAdminProductImage(imageId);

      setMessage("Image supprimée");
      await loadProducts();
    } catch (err) {
      console.error("DELETE IMAGE ERROR =", err);
      setError(err.message);
    }
  };

  const editingProduct =
    editingId != null
      ? products.find((product) => Number(product.id) === Number(editingId))
      : null;

  return (
    <main className="page">
      <section className="auth-card">
        <h1>Administration des produits</h1>

        {error && <p className="page-message error">{error}</p>}
        {message && <p className="page-message success">{message}</p>}

        <h2>{editingId ? "Modifier un produit" : "Créer un produit"}</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            name="name"
            type="text"
            placeholder="Nom"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="slug"
            type="text"
            placeholder="Slug"
            value={form.slug}
            onChange={handleChange}
          />

          <input
            name="sku"
            type="text"
            placeholder="SKU"
            value={form.sku}
            onChange={handleChange}
          />

          <input
            name="short_description"
            type="text"
            placeholder="Description courte"
            value={form.short_description}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description complète"
            value={form.description}
            onChange={handleChange}
            rows={5}
          />

          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Prix"
            value={form.price}
            onChange={handleChange}
          />

          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
          />

          <label className="admin-checkbox">
            <input
              name="is_active"
              type="checkbox"
              checked={form.is_active}
              onChange={handleChange}
            />
            Produit actif
          </label>

          <div className="admin-form-actions">
            <button className="product-detail__button" type="submit">
              {editingId ? "Mettre à jour" : "Créer"}
            </button>

            {editingId && (
              <button
                className="admin-secondary-button"
                type="button"
                onClick={resetForm}
              >
                Annuler
              </button>
            )}
          </div>

          {!editingId && (
            <div style={{ marginTop: "12px" }}>
              <label
                htmlFor="create-product-images"
                style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}
              >
                Images du produit
              </label>

              <input
                id="create-product-images"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleCreateImagesChange}
              />

              {createImages.length > 0 && (
                <p style={{ marginTop: "8px" }}>
                  {createImages.length} image(s) sélectionnée(s)
                </p>
              )}
            </div>
          )}

          {editingId && (
            <div style={{ marginTop: "12px" }}>
              <label
                htmlFor="edit-product-images"
                style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}
              >
                Ajouter de nouvelles images
              </label>

              <input
                id="edit-product-images"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleEditImagesChange}
              />

              {editImages.length > 0 && (
                <p style={{ marginTop: "8px" }}>
                  {editImages.length} nouvelle(s) image(s) sélectionnée(s)
                </p>
              )}
            </div>
          )}
        </form>

        {editingId && editingProduct && (
          <div style={{ marginTop: "24px" }}>
            <h3>Images actuelles du produit</h3>

            {editingProduct.images && editingProduct.images.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "16px",
                  marginTop: "12px",
                }}
              >
                {editingProduct.images.map((image) => (
                  <div
                    key={image.id}
                    style={{
                      background: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "12px",
                      padding: "12px",
                }}
              >
                <img
                  src={image.image_url}
                  alt={editingProduct.name}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    display: "block",
                    marginBottom: "10px",
                  }}
                  onError={(e) => {
                    e.currentTarget.src =
                      "http://localhost:3000/uploads/default.jpg";
                  }}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={() => handleSetPrimaryImage(editingProduct.id, image.id)}
                  >
                    Mettre en première
                  </button>

                  <button
                    type="button"
                    className="admin-delete-button"
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    Supprimer l'image
                  </button>
                </div>
              </div>
            ))}
              </div>
            ) : (
              <p style={{ marginTop: "12px" }}>Aucune image pour ce produit.</p>
            )}
          </div>
        )}
      </section>

      <section className="orders-list">
        {products.map((product) => (
          <article key={product.id} className="order-card">
            <div style={{ marginBottom: "12px" }}>
              {product.images && product.images.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginBottom: "12px",
                  }}
                >
                  {product.images.map((img) => (
                    <img
                      key={img.id}
                      src={img.image_url}
                      alt={product.name}
                      style={{
                        width: "90px",
                        height: "90px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        display: "block",
                      }}
                      onError={(e) => {
                        e.currentTarget.src =
                          "http://localhost:3000/uploads/default.jpg";
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p>Aucune image</p>
              )}
            </div>

            <p>
              <strong>ID :</strong> {product.id}
            </p>
            <p>
              <strong>Nom :</strong> {product.name}
            </p>
            <p>
              <strong>Prix :</strong> {product.price} €
            </p>
            <p>
              <strong>Stock :</strong> {product.stock}
            </p>
            <p>
              <strong>Actif :</strong>{" "}
              {Number(product.is_active) ? "Oui" : "Non"}
            </p>

            <div className="admin-form-actions">
              <button
                className="product-detail__button"
                type="button"
                onClick={() => handleEdit(product)}
              >
                Modifier
              </button>

              <button
                className="admin-delete-button"
                type="button"
                onClick={() => handleDelete(product.id)}
              >
                Supprimer
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}