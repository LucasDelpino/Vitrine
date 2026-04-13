import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addProductToCart } from "../services/cartApi.js";

export default function ProductDetail({ refreshCartCount }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Produit introuvable");
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setSelectedImage(data.image_url);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addProductToCart(product.id, 1);
      await refreshCartCount();
      setMessage("Produit ajouté au panier");
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) {
    return <p className="page-message">Chargement...</p>;
  }

  if (error) {
    return (
      <main className="page">
        <p className="page-message error">{error}</p>
        <Link className="back-link" to="/">
          Retour à l'accueil
        </Link>
      </main>
    );
  }

  return (
    <main className="page">
      <Link className="back-link" to="/">
        ← Retour
      </Link>

      <section className="product-detail product-detail--layout">
        <div className="product-detail__media">
          <img
            className="product-detail__image"
            src={selectedImage}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = "http://localhost:3000/uploads/default.jpg";
            }}
          />

          {product.images && product.images.length > 1 && (
            <div className="product-detail__gallery">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  className={`product-detail__thumb-button ${
                    selectedImage === img.image_url ? "is-active" : ""
                  }`}
                  onClick={() => setSelectedImage(img.image_url)}
                >
                  <img
                    className="product-detail__thumb"
                    src={img.image_url}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.src =
                        "http://localhost:3000/uploads/default.jpg";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail__content">
          <h1 className="product-detail__title">{product.name}</h1>
          <p className="product-detail__description">{product.description}</p>
          <p className="product-detail__price">{product.price} €</p>
          <p className="product-detail__meta">
            Ajouté le : {new Date(product.created_at).toLocaleDateString()}
          </p>

          <button
            className="product-detail__button"
            type="button"
            onClick={handleAddToCart}
          >
            Ajouter au panier
          </button>

          {message && <p className="product-detail__message">{message}</p>}
        </div>
      </section>
    </main>
  );
}