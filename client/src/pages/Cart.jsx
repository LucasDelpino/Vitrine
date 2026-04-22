import { useEffect, useState } from "react";
import {
  fetchCart,
  removeFromCart,
  clearCart
} from "../services/cartApi.js";
import { buildApiUrl } from "../config/api.js";

export default function Cart({ refreshCartCount }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await fetchCart();
      setCart(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Impossible de charger le panier");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    await loadCart();
    if (refreshCartCount) refreshCartCount();
  };

  const handleClear = async () => {
    await clearCart();
    setCart([]);
    if (refreshCartCount) refreshCartCount();
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  // 🔥 NOUVELLE LOGIQUE STRIPE PRO
  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);

      // 1️⃣ Créer la commande
      const orderRes = await fetch(buildApiUrl("/orders"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || "Erreur création commande");
      }

      const orderId = orderData.order.id;

      // 2️⃣ Construire les items Stripe
      const items = cart.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name
          },
          unit_amount: Math.round(Number(item.price) * 100)
        },
        quantity: item.quantity
      }));

      // 3️⃣ Créer session Stripe
      const stripeRes = await fetch(
        buildApiUrl("/stripe/create-checkout-session"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            items,
            orderId // 🔥 CRUCIAL
          })
        }
      );

      const stripeData = await stripeRes.json();

      if (!stripeRes.ok) {
        throw new Error(stripeData.error || "Erreur Stripe");
      }

      // 4️⃣ Redirection Stripe
      window.location.href = stripeData.url;

    } catch (err) {
      console.error(err);
      alert(err.message || "Erreur paiement");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="page">
      <h1>Panier</h1>

      {cart.length === 0 && <p>Votre panier est vide</p>}

      {cart.map((item) => (
        <div key={item.product_id}>
          <p>{item.name}</p>
          <p>{item.quantity} x {item.price} €</p>

          <button onClick={() => handleRemove(item.product_id)}>
            Supprimer
          </button>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <h2>Total : {total.toFixed(2)} €</h2>

          <button onClick={handleCheckout} disabled={checkoutLoading}>
            {checkoutLoading ? "Chargement..." : "Payer"}
          </button>

          <button onClick={handleClear}>
            Vider le panier
          </button>
        </>
      )}
    </div>
  );
}