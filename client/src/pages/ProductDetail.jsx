import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addProductToCart } from "../services/cartApi.js";
import { fetchProductById } from "../services/productApi.js";
import { buildUploadUrl } from "../config/api.js";

export default function ProductDetail({ refreshCartCount }) {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setMessage("");

        const data = await fetchProductById(id);
        setProduct(data);

        const firstImage =
          Array.isArray(data.images) && data.images.length > 0
            ? buildUploadUrl(data.images[0].image_url)
            : buildUploadUrl(data.image_url);

        setSelectedImage(firstImage);
      } catch (err) {
        setError(err.message || "Impossible de charger le produit");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const galleryImages = useMemo(() => {
    if (!product) return [];

    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.map((img) => ({
        id: img.id,
        url: buildUploadUrl(img.image_url),
      }));
    }

    if (product.image_url) {
      return [
        {
          id: "main-image",
          url: buildUploadUrl(product.image_url),
        },
      ];
    }

    return [
      {
        id: "default-image",
        url: buildUploadUrl(),
      },
    ];
  }, [product]);

  const handleAddToCart = async () => {
    try {
      if (!product) return;

      await addProductToCart(product.id, 1);

      if (typeof refreshCartCount === "function") {
        await refreshCartCount();
      }

      setMessage("Produit ajouté au panier");
    } catch (err) {
      setMessage(err.message || "Impossible d'ajouter le produit au panier");
    }
  };

  if (loading) {
    return <div className="page-message">Chargement du produit...</div>;
  }

  if (error || !product) {
    return (
      <div className="page-message">
        <p className="error">{error || "Produit introuvable"}</p>
        <Link to="/" className="back-link">
          Retour à l’accueil
        </Link>
      </div>
    );
  }

  return (
    <section className="page">
      <Link to="/" className="back-link">
        ← Retour
      </Link>

      <div className="product-detail">
        <div className="product-detail--layout">
          <div className="product-detail__media">
            <img
              className="product-detail__image"
              src={selectedImage || buildUploadUrl()}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src = buildUploadUrl();
              }}
            />

            {galleryImages.length > 1 && (
              <div className="product-detail__gallery">
                {galleryImages.map((img) => {
                  const isActive = selectedImage === img.url;

                  return (
                    <button
                      key={img.id}
                      type="button"
                      className={`product-detail__thumb-button ${
                        isActive ? "is-active" : ""
                      }`}
                      onClick={() => setSelectedImage(img.url)}
                    >
                      <img
                        className="product-detail__thumb"
                        src={img.url}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src = buildUploadUrl();
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="product-detail__content">
            <h1 className="product-detail__title">{product.name}</h1>

            <p className="product-detail__description">
              {product.description || "Aucune description disponible."}
            </p>

            <p className="product-detail__price">
              {Number(product.price).toFixed(2)} €
            </p>

            <p className="product-detail__meta">
              Stock : {product.stock ?? 0}
            </p>

            <p className="product-detail__meta">
              Ajouté le :{" "}
              {product.created_at
                ? new Date(product.created_at).toLocaleDateString()
                : "Date inconnue"}
            </p>

            <button
              type="button"
              className="product-detail__button"
              onClick={handleAddToCart}
            >
              Ajouter au panier
            </button>

            {message && <p className="product-detail__message">{message}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}