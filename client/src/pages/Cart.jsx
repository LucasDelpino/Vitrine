import { useEffect, useState } from "react";
import {
  fetchCart,
  removeFromCart,
  clearCart,
} from "../services/cartApi.js";
import { buildApiUrl } from "../config/api.js";
import { getToken } from "../utils/auth.js";

function getCheckoutHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseError(response, fallbackMessage) {
  try {
    const data = await response.json();
    return data.error || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

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
      setError("");
      const data = await fetchCart();
      setCart(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Impossible de charger le panier");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      await loadCart();

      if (typeof refreshCartCount === "function") {
        await refreshCartCount();
      }
    } catch (err) {
      alert(err.message || "Impossible de supprimer le produit");
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      setCart([]);

      if (typeof refreshCartCount === "function") {
        await refreshCartCount();
      }
    } catch (err) {
      alert(err.message || "Impossible de vider le panier");
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);

      const token = getToken();

      if (!token) {
        throw new Error("Vous devez être connecté pour payer");
      }

      // 1. Créer la commande côté backend
      const orderResponse = await fetch(buildApiUrl("/orders"), {
        method: "POST",
        headers: getCheckoutHeaders(),
      });

      if (!orderResponse.ok) {
        throw new Error(
          await parseError(orderResponse, "Erreur création commande")
        );
      }

      const orderData = await orderResponse.json();
      const orderId = orderData?.order?.id;

      if (!orderId) {
        throw new Error("Commande invalide");
      }

      // 2. Construire les lignes Stripe à partir du panier courant
      const items = cart.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity,
      }));

      // 3. Créer la session Stripe
      const stripeResponse = await fetch(
        buildApiUrl("/stripe/create-checkout-session"),
        {
          method: "POST",
          headers: getCheckoutHeaders(),
          body: JSON.stringify({
            items,
            orderId,
          }),
        }
      );

      if (!stripeResponse.ok) {
        throw new Error(
          await parseError(stripeResponse, "Erreur session Stripe")
        );
      }

      const stripeData = await stripeResponse.json();

      if (!stripeData?.url) {
        throw new Error("URL Stripe introuvable");
      }

      window.location.href = stripeData.url;
    } catch (err) {
      alert(err.message || "Erreur paiement");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <div className="page-message">Chargement du panier...</div>;
  }

  if (error) {
    return <div className="page-message error">{error}</div>;
  }

  return (
    <div className="page">
      <h1>Panier</h1>

      {cart.length === 0 ? (
        <p>Votre panier est vide</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.product_id}>
              <p>{item.name}</p>
              <p>
                {item.quantity} × {Number(item.price).toFixed(2)} €
              </p>

              <button onClick={() => handleRemove(item.product_id)}>
                Supprimer
              </button>
            </div>
          ))}

          <h2>Total : {total.toFixed(2)} €</h2>

          <button onClick={handleCheckout} disabled={checkoutLoading}>
            {checkoutLoading ? "Chargement..." : "Payer"}
          </button>

          <button onClick={handleClear}>Vider le panier</button>
        </>
      )}
    </div>
  );
}