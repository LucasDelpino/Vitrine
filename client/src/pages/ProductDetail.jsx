import { useEffect, useState } from "react";
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
        const data = await fetchProductById(id);
        setProduct(data);

        const mainImage =
          data.images && data.images.length > 0
            ? buildUploadUrl(data.images[0].image_url)
            : buildUploadUrl(data.image_url);

        setSelectedImage(mainImage);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
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
    return <p>Chargement...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <section>
      <Link to="/">← Retour</Link>

      <div>
        <img
          src={selectedImage || buildUploadUrl()}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src = buildUploadUrl();
          }}
        />
      </div>

      {product.images && product.images.length > 0 && (
        <div>
          {product.images.map((img) => (
            <img
              key={img.id}
              src={buildUploadUrl(img.image_url)}
              alt={product.name}
              onClick={() => setSelectedImage(buildUploadUrl(img.image_url))}
              onError={(e) => {
                e.currentTarget.src = buildUploadUrl();
              }}
            />
          ))}
        </div>
      )}

      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>{product.price} €</p>
      <p>Ajouté le : {new Date(product.created_at).toLocaleDateString()}</p>

      <button onClick={handleAddToCart}>Ajouter au panier</button>

      {message && <p>{message}</p>}
    </section>
  );
}