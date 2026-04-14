import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { fetchProducts } from "../services/productApi.js";
import { buildUploadUrl } from "../config/api.js";
import "./Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message || "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  const featuredProducts = products.slice(0, 6);

  // Remplace le nom si ton fichier est différent dans server/public/uploads
  const heroImage = buildUploadUrl("IMG_2093.jpeg");

  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">Bijoux faits main</p>
          <h1 className="hero__title">Nelegance</h1>
          <p className="hero__subtitle">
            Des bijoux délicats, lumineux et intemporels, imaginés et façonnés
            à la main dans le sud de la France.
          </p>

          <div className="hero__actions">
            <Link to="/" className="btn btn--primary">
              Découvrir la collection
            </Link>
            <a href="#featured" className="btn btn--secondary">
              Voir les créations
            </a>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__card">
            <img
              className="hero__image"
              src={heroImage}
              alt="L'artisane Nelegance en plein travail"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            <div className="hero__overlay" />

            <div className="hero__card-content">
              <span className="hero__tag">Élégance artisanale</span>
              <p>
                Une création façonnée à la main, avec patience, précision et
                sens du détail.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="intro">
        <div className="intro__item">
          <h2>Création artisanale</h2>
          <p>Chaque bijou est réalisé avec soin, en petite série.</p>
        </div>

        <div className="intro__item">
          <h2>Style intemporel</h2>
          <p>Des lignes sobres et féminines, faciles à porter au quotidien.</p>
        </div>

        <div className="intro__item">
          <h2>Esprit du sud</h2>
          <p>Une inspiration douce, lumineuse et naturelle.</p>
        </div>
      </section>

      <section id="featured" className="featured">
        <div className="section-head">
          <div>
            <p className="section-head__eyebrow">Collection</p>
            <h2>Les créations à découvrir</h2>
          </div>

          <Link to="/" className="section-head__link">
            Voir toute la collection
          </Link>
        </div>

        {loading && <p className="state-text">Chargement des créations...</p>}
        {error && <p className="state-text">{error}</p>}

        {!loading && !error && (
          <div className="featured__grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="story">
        <div className="story__content">
          <p className="section-head__eyebrow">L’univers Nelegance</p>
          <h2>Une maison de bijoux douce et raffinée</h2>
          <p>
            Nelegance célèbre les gestes simples, la matière, la lumière et le
            détail. Chaque pièce est pensée pour révéler une élégance discrète
            et accompagner les instants de tous les jours.
          </p>
          <Link to="/" className="btn btn--primary">
            Voir la collection
          </Link>
        </div>
      </section>

      <section className="trust">
        <div className="trust__item">
          <h3>Fabrication soignée</h3>
          <p>Une attention portée à chaque finition.</p>
        </div>

        <div className="trust__item">
          <h3>Envoi délicat</h3>
          <p>Des commandes préparées avec simplicité et soin.</p>
        </div>

        <div className="trust__item">
          <h3>Beauté durable</h3>
          <p>Des bijoux pensés pour traverser le temps avec élégance.</p>
        </div>
      </section>
    </main>
  );
}