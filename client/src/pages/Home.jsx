import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { createOrder } from "../services/orderApi.js";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Impossible de charger les produits");
        }
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="page-message">Chargement...</p>;
  }

  if (error) {
    return <p className="page-message error">{error}</p>;
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="hero__eyebrow">Collection</p>
        <h1 className="hero__title">Bijoux élégants et raffinés</h1>
        <p className="hero__subtitle">
          Une boutique React connectée à ton API Node.js, avec images et panier.
        </p>
      </section>

      <section className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </main>
  );
}