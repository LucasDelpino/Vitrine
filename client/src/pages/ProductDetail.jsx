import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addProductToCart } from "../services/cartApi.js";
import { fetchProductById } from "../services/productApi.js";
import { buildUploadUrl } from "../config/api.js";

const LOW_STOCK_LIMIT = 3;
const SWIPE_MIN_DISTANCE = 45;

export default function ProductDetail({ refreshCartCount }) {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setMessage("");

        const data = await fetchProductById(id);
        setProduct(data);
        setSelectedImageIndex(0);
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

  const selectedImage =
    galleryImages[selectedImageIndex]?.url || buildUploadUrl();

  const stock = Number(product?.stock || 0);
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= LOW_STOCK_LIMIT;
  const hasMultipleImages = galleryImages.length > 1;

  const goToPreviousImage = () => {
    if (!hasMultipleImages) return;

    setSelectedImageIndex((currentIndex) =>
      currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1
    );
  };

  const goToNextImage = () => {
    if (!hasMultipleImages) return;

    setSelectedImageIndex((currentIndex) =>
      currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1
    );
  };

  const handleTouchStart = (event) => {
    setTouchStartX(event.touches[0].clientX);
  };

  const handleTouchEnd = (event) => {
    if (touchStartX === null || !hasMultipleImages) return;

    const touchEndX = event.changedTouches[0].clientX;
    const distance = touchStartX - touchEndX;

    if (distance > SWIPE_MIN_DISTANCE) {
      goToNextImage();
    }

    if (distance < -SWIPE_MIN_DISTANCE) {
      goToPreviousImage();
    }

    setTouchStartX(null);
  };

  const handleAddToCart = async () => {
    try {
      if (!product) return;

      if (isOutOfStock) {
        setMessage("Ce produit est actuellement en rupture de stock.");
        return;
      }

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
            <div
              style={{
                position: "relative",
                touchAction: "pan-y",
                userSelect: "none",
              }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                className="product-detail__image"
                src={selectedImage}
                alt={product.name}
                draggable="false"
                onError={(e) => {
                  e.currentTarget.src = buildUploadUrl();
                }}
              />

              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    aria-label="Image précédente"
                    onClick={goToPreviousImage}
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      border: "1px solid rgba(155, 111, 111, 0.25)",
                      background: "rgba(255, 255, 255, 0.82)",
                      cursor: "pointer",
                      fontSize: "22px",
                    }}
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    aria-label="Image suivante"
                    onClick={goToNextImage}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      border: "1px solid rgba(155, 111, 111, 0.25)",
                      background: "rgba(255, 255, 255, 0.82)",
                      cursor: "pointer",
                      fontSize: "22px",
                    }}
                  >
                    ›
                  </button>

                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      bottom: "14px",
                      transform: "translateX(-50%)",
                      padding: "5px 10px",
                      borderRadius: "999px",
                      background: "rgba(255, 255, 255, 0.82)",
                      fontSize: "13px",
                    }}
                  >
                    {selectedImageIndex + 1} / {galleryImages.length}
                  </div>
                </>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="product-detail__gallery">
                {galleryImages.map((img, index) => {
                  const isActive = selectedImageIndex === index;

                  return (
                    <button
                      key={img.id}
                      type="button"
                      className={`product-detail__thumb-button ${
                        isActive ? "is-active" : ""
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        className="product-detail__thumb"
                        src={img.url}
                        alt={product.name}
                        draggable="false"
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

            {isOutOfStock && (
              <p
                className="product-detail__message"
                style={{
                  color: "#b00020",
                  fontWeight: "700",
                  marginTop: "12px",
                }}
              >
                Rupture de stock ! Produit victime de son succès
              </p>
            )}

            {isLowStock && (
              <p
                className="product-detail__message"
                style={{
                  color: "#b36b00",
                  fontWeight: "700",
                  marginTop: "12px",
                }}
              >
                Plus que {stock} en stock
              </p>
            )}

            <p className="product-detail__price">
              {Number(product.price).toFixed(2)} €
            </p>

            <p className="product-detail__meta">
              Ajouté le :{" "}
              {product.created_at
                ? new Date(product.created_at).toLocaleDateString("fr-FR")
                : "Date inconnue"}
            </p>

            <button
              type="button"
              className="product-detail__button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{
                opacity: isOutOfStock ? 0.55 : 1,
                cursor: isOutOfStock ? "not-allowed" : "pointer",
              }}
            >
              {isOutOfStock ? "Produit indisponible" : "Ajouter au panier"}
            </button>

            {message && <p className="product-detail__message">{message}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}