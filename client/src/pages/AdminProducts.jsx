import { useEffect, useMemo, useState } from "react";
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
import { buildUploadUrl } from "../config/api.js";
import "./AdminProducts.css";

const initialForm = {
  name: "",
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
  const [createImages, setCreateImages] = useState([]);
  const [editImages, setEditImages] = useState([]);

  const editingProduct = useMemo(() => {
    if (editingId == null) return null;
    return products.find((product) => Number(product.id) === Number(editingId)) || null;
  }, [editingId, products]);

  const loadProducts = async () => {
    try {
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch (err) {
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

  const uploadMultipleImages = async (productId, files) => {
    for (const file of files) {
      await uploadAdminProductImage(productId, file);
    }
  };

  const handleCreateImagesChange = (event) => {
    setCreateImages(Array.from(event.target.files || []));
  };

  const handleEditImagesChange = (event) => {
    setEditImages(Array.from(event.target.files || []));
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
        const newProductId = createdProduct?.id || createdProduct?.product?.id || null;

        if (!newProductId) {
          throw new Error("Produit créé mais identifiant introuvable");
        }

        if (createImages.length > 0) {
          await uploadMultipleImages(newProductId, createImages);
        }

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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      setError(err.message);
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
      setError(err.message);
    }
  };

  const resolveImageUrl = (imageUrl) => {
    if (!imageUrl) return buildUploadUrl();
    return buildUploadUrl(imageUrl);
  };

  return (
    <main className="admin-products-page page">
      <section className="admin-products-hero">
        <div>
          <h1 className="admin-products-hero__title">Produits</h1>
        </div>

        <div className="admin-products-hero__stats">
          <div className="admin-stat-card">
            <span className="admin-stat-card__value">{products.length}</span>
            <span className="admin-stat-card__label">Produits</span>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-card__value">
              {products.filter((product) => Number(product.is_active)).length}
            </span>
            <span className="admin-stat-card__label">Actifs</span>
          </div>
        </div>
      </section>

      {(error || message) && (
        <section className="admin-feedback">
          {error && <p className="admin-feedback__error">{error}</p>}
          {message && <p className="admin-feedback__success">{message}</p>}
        </section>
      )}

      <section className="admin-editor-card">
        <div className="admin-editor-card__head">
          <div>
            <h2>{editingId ? "Modifier un produit" : "Créer un produit"}</h2>
          </div>

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

        <form onSubmit={handleSubmit} className="admin-products-form">
          <div className="admin-field">
            <label htmlFor="name">Nom</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Nom du produit"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="description">Description complète</label>
            <textarea
              id="description"
              name="description"
              placeholder="Décris le produit"
              value={form.description}
              onChange={handleChange}
              rows={5}
            />
          </div>

          <div className="admin-field-grid admin-field-grid--compact">
            <div className="admin-field">
              <label htmlFor="price">Prix</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="stock">Stock</label>
              <input
                id="stock"
                name="stock"
                type="number"
                placeholder="0"
                value={form.stock}
                onChange={handleChange}
              />
            </div>
          </div>

          <label className="admin-toggle">
            <input
              name="is_active"
              type="checkbox"
              checked={form.is_active}
              onChange={handleChange}
            />
            <span>Produit actif</span>
          </label>

          {!editingId && (
            <div className="admin-upload-box">
              <label htmlFor="create-product-images">Images du produit</label>
              <input
                id="create-product-images"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleCreateImagesChange}
              />
              {createImages.length > 0 && (
                <p className="admin-upload-box__meta">
                  {createImages.length} image(s) sélectionnée(s)
                </p>
              )}
            </div>
          )}

          {editingId && (
            <div className="admin-upload-box">
              <label htmlFor="edit-product-images">Ajouter des images</label>
              <input
                id="edit-product-images"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleEditImagesChange}
              />
              {editImages.length > 0 && (
                <p className="admin-upload-box__meta">
                  {editImages.length} nouvelle(s) image(s) sélectionnée(s)
                </p>
              )}
            </div>
          )}

          <div className="admin-form-actions">
            <button className="product-detail__button" type="submit">
              {editingId ? "Enregistrer" : "Créer le produit"}
            </button>
          </div>
        </form>

        {editingId && editingProduct && (
          <section className="admin-image-manager">
            <div className="admin-image-manager__head">
              <h3>Images du produit</h3>
              <p>Choisis l’image principale ou supprime un visuel.</p>
            </div>

            {editingProduct.images && editingProduct.images.length > 0 ? (
              <div className="admin-image-grid">
                {editingProduct.images.map((image) => (
                  <article className="admin-image-card" key={image.id}>
                    <img
                      src={resolveImageUrl(image.image_url)}
                      alt={editingProduct.name}
                      className="admin-image-card__image"
                      onError={(e) => {
                        e.currentTarget.src = buildUploadUrl();
                      }}
                    />

                    <div className="admin-image-card__actions">
                      <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={() =>
                          handleSetPrimaryImage(editingProduct.id, image.id)
                        }
                      >
                        Mettre en avant
                      </button>

                      <button
                        type="button"
                        className="admin-delete-button"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="admin-empty-text">Aucune image pour ce produit.</p>
            )}
          </section>
        )}
      </section>

      <section className="admin-products-list">
        <div className="admin-products-list__head">
          <div>
            <p className="admin-section-label">Catalogue</p>
            <h2>Produits existants</h2>
          </div>
        </div>

        <div className="admin-products-grid">
          {products.map((product) => {
            const firstImage =
              product.images && product.images.length > 0
                ? resolveImageUrl(product.images[0].image_url)
                : buildUploadUrl();

            return (
              <article className="admin-product-card" key={product.id}>
                <div className="admin-product-card__media">
                  <img
                    src={firstImage}
                    alt={product.name}
                    className="admin-product-card__image"
                    onError={(e) => {
                      e.currentTarget.src = buildUploadUrl();
                    }}
                  />

                  <span className="admin-product-card__badge">
                    {product.images?.length || 0} image(s)
                  </span>
                </div>

                <div className="admin-product-card__body">
                  <div className="admin-product-card__top">
                    <p className="admin-product-card__id">#{product.id}</p>
                    <span
                      className={`admin-status ${
                        Number(product.is_active)
                          ? "admin-status--active"
                          : "admin-status--inactive"
                      }`}
                    >
                      {Number(product.is_active) ? "Actif" : "Inactif"}
                    </span>
                  </div>

                  <h3 className="admin-product-card__title">{product.name}</h3>

                  <p className="admin-product-card__description">
                    {product.short_description ||
                      product.description ||
                      "Aucune description."}
                  </p>

                  <div className="admin-product-card__meta">
                    <div>
                      <span>Prix</span>
                      <strong>{Number(product.price).toFixed(2)} €</strong>
                    </div>

                    <div>
                      <span>Stock</span>
                      <strong>{product.stock}</strong>
                    </div>
                  </div>

                  <div className="admin-product-card__actions">
                    <button
                      className="admin-secondary-button"
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
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}