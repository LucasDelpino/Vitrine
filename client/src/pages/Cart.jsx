import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createOrder } from "../services/orderApi.js";
import { useNavigate } from "react-router-dom";
import { createStripeCheckoutSession } from "../services/stripeApi.js";
import {
  fetchCart,
  removeProductFromCart,
  clearCartApi
} from "../services/cartApi.js";

export default function Cart({ refreshCartCount }) {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const loadCart = async () => {
    try {
      const data = await fetchCart();
      setCart(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeProductFromCart(productId);
      await loadCart();
      await refreshCartCount();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCartApi();
      await loadCart();
      await refreshCartCount();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckout = async () => {
    try {
      const result = await createOrder();
      await refreshCartCount();

      const stripeSession = await createStripeCheckoutSession(result.order.id);

      window.location.href = stripeSession.url;
    } catch (err) {
      setError(err.message);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <main className="page">
      <h1>Mon panier</h1>

      {error && <p className="page-message error">{error}</p>}
      {message && <p className="product-detail__message">{message}</p>}

      {cart.length === 0 ? (
        <p>Ton panier est vide.</p>
      ) : (
        <>
          {cart.map((item) => (
            <article key={item.product_id} className="product-card">
              <h2>{item.name}</h2>
              <p>Quantité : {item.quantity}</p>
              <p>Prix : {item.price} €</p>
              <button
                className="product-detail__button"
                type="button"
                onClick={() => handleRemove(item.product_id)}
              >
                Supprimer
              </button>
            </article>
          ))}

          <h2>Total : {total.toFixed(2)} €</h2>

          <button
            className="product-detail__button"
            type="button"
            onClick={handleCheckout}
          >
              Commander
          </button>

          {message && <p className="product-detail__message">{message}</p>}

          <button
            className="product-detail__button"
            type="button"
            onClick={handleClearCart}
          >
            Vider le panier
          </button>
        </>
      )}

      <br />
      <br />

      <Link className="back-link" to="/">
        Retour à l'accueil
      </Link>
    </main>
  );
}