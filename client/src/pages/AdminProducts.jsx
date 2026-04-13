import { useEffect, useState } from "react";
import {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "../services/adminProductApi.js";
import { uploadAdminProductImage } from "../services/adminProductImageApi.js";

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

  const loadProducts = async () => {
    try {
      const data = await fetchAdminProducts();
      console.log("ADMIN PRODUCTS =", data);
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
    setError("");
    setMessage("");
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
        setMessage("Produit mis à jour");
      } else {
        await createAdminProduct(payload);
        setMessage("Produit créé");
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
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

      setMessage("Produit supprimé");
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImageUpload = async (productId, file) => {
    if (!file) return;

    try {
      setError("");
      setMessage("");

      await uploadAdminProductImage(productId, file);

      setMessage("Image ajoutée");
      await loadProducts();
    } catch (err) {
      console.error("UPLOAD IMAGE ERROR =", err);
      setError(err.message);
    }
  };

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
        </form>
      </section>

      <section className="orders-list">
        {products.map((product) => (
          <article key={product.id} className="order-card">
            <div style={{ marginBottom: "12px" }}>
              <p>
                <strong>Image URL :</strong> {product.image_url || "Aucune"}
              </p>

              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    border: "1px solid #ccc",
                    display: "block",
                  }}
                  onLoad={() => {
                    console.log("IMAGE OK =", product.image_url);
                  }}
                  onError={() => {
                    console.error("IMAGE ERROR =", product.image_url);
                  }}
                />
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

            <div style={{ marginTop: "12px" }}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) =>
                  handleImageUpload(product.id, e.target.files?.[0])
                }
              />
            </div>

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