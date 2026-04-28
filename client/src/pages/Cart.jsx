import { useEffect, useState } from "react";
import {
  fetchCart,
  removeFromCart,
  clearCart,
} from "../services/cartApi.js";
import { buildApiUrl } from "../config/api.js";
import { getToken } from "../utils/auth.js";
import { createOrder } from "../services/orderApi.js";

const SHIPPING_OPTIONS = [
  {
    method: "home",
    label: "Livraison à domicile (avec suivi)",
    description: "Expédition directement à votre adresse. Numéro de suivi fourni par mail.",
    price: 4.9,
  },
  {
    method: "relay",
    label: "Livraison en point relais",
    description: "Livraison dans un point relais proche de chez vous.",
    price: 3.9,
  },
];

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

function formatPrice(value) {
  return `${Number(value || 0).toFixed(2)} €`;
}

export default function Cart({ refreshCartCount }) {
  const [cart, setCart] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("home");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const selectedShipping = SHIPPING_OPTIONS.find(
    (option) => option.method === selectedShippingMethod
  );

  const productsTotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const shippingTotal = selectedShipping ? selectedShipping.price : 0;
  const total = productsTotal + shippingTotal;

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

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);

      const token = getToken();

      if (!token) {
        throw new Error("Vous devez être connecté pour payer");
      }

      if (!selectedShippingMethod) {
        throw new Error("Veuillez choisir un mode de livraison");
      }

      const orderData = await createOrder({
        shippingMethod: selectedShippingMethod,
      });

      const orderId = orderData?.order?.id;

      if (!orderId) {
        throw new Error("Commande invalide");
      }

      const stripeResponse = await fetch(
        buildApiUrl("/stripe/create-checkout-session"),
        {
          method: "POST",
          headers: getCheckoutHeaders(),
          body: JSON.stringify({
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
          <div className="orders-list">
            {cart.map((item) => (
              <article key={item.product_id} className="order-card">
                <p>
                  <strong>{item.name}</strong>
                </p>
                <p>
                  {item.quantity} × {formatPrice(item.price)}
                </p>

                <button
                  type="button"
                  className="admin-delete-button"
                  onClick={() => handleRemove(item.product_id)}
                >
                  Supprimer
                </button>
              </article>
            ))}
          </div>

          <section className="order-card" style={{ marginTop: "24px" }}>
            <h2>Mode de livraison</h2>

            {SHIPPING_OPTIONS.map((option) => (
              <label
                key={option.method}
                style={{
                  display: "block",
                  padding: "12px",
                  marginBottom: "10px",
                  border: "1px solid rgba(155, 111, 111, 0.16)",
                  borderRadius: "16px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="shippingMethod"
                  value={option.method}
                  checked={selectedShippingMethod === option.method}
                  onChange={(e) => setSelectedShippingMethod(e.target.value)}
                  style={{ marginRight: "10px" }}
                />

                <strong>{option.label}</strong> — {formatPrice(option.price)}
                <br />
                <span style={{ color: "#655350" }}>{option.description}</span>
              </label>
            ))}
          </section>

          <section className="order-card" style={{ marginTop: "24px" }}>
            <p>
              <strong>Sous-total produits :</strong>{" "}
              {formatPrice(productsTotal)}
            </p>
            <p>
              <strong>Livraison :</strong> {formatPrice(shippingTotal)}
            </p>
            <h2>Total : {formatPrice(total)}</h2>
          </section>

          <button
            type="button"
            className="product-detail__button"
            onClick={handleCheckout}
            disabled={checkoutLoading}
          >
            {checkoutLoading ? "Redirection..." : "Payer"}
          </button>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={handleClear}
            style={{ marginLeft: "10px" }}
          >
            Vider le panier
          </button>
        </>
      )}
    </div>
  );
}