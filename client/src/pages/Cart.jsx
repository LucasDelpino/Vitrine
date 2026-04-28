import { useEffect, useState } from "react";
import { fetchCart, removeFromCart, clearCart } from "../services/cartApi.js";
import { createOrder } from "../services/orderApi.js";
import { buildApiUrl } from "../config/api.js";
import { getToken } from "../utils/auth.js";

const FREE_SHIPPING_THRESHOLD = 50;

const SHIPPING_OPTIONS = [
  {
    method: "home",
    label: "Livraison à domicile (avec suivi)",
    description:
      "Expédition directement à votre adresse. Numéro de suivi fourni par mail.",
    price: 4.9,
  },
  {
    method: "relay",
    label: "Livraison en point relais Mondial Relay",
    description: "Choisissez un point relais proche de chez vous.",
    price: 3.9,
  },
];

function formatPrice(value) {
  return `${Number(value || 0).toFixed(2)} €`;
}

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

function getFreeShippingRemaining(productsTotal) {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - Number(productsTotal || 0));
}

export default function Cart({ refreshCartCount }) {
  const [cart, setCart] = useState([]);
  const [shippingMethod, setShippingMethod] = useState("home");
  const [relayPoint, setRelayPoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedShipping = SHIPPING_OPTIONS.find(
    (option) => option.method === shippingMethod
  );

  const productsTotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const freeShipping = productsTotal >= FREE_SHIPPING_THRESHOLD;
  const remainingForFreeShipping = getFreeShippingRemaining(productsTotal);
  const shippingTotal = freeShipping ? 0 : selectedShipping?.price || 0;
  const total = productsTotal + shippingTotal;

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
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
  }

  function handleShippingChange(method) {
    setShippingMethod(method);

    if (method !== "relay") {
      setRelayPoint(null);
    }
  }

  function handleOpenRelayWidget() {
    if (!window.$ || !window.$.fn?.MR_ParcelShopPicker) {
      alert("Widget Mondial Relay non chargé. Vérifie les scripts dans index.html.");
      return;
    }

    window.$("#relay-widget").html("");

    window.$("#relay-widget").MR_ParcelShopPicker({
      Target: "#relay-widget",
      Brand: "CC22",
      Country: "FR",
      Responsive: true,
      OnParcelShopSelected: function (data) {
        const point = {
          id: data.Num || "",
          name: data.Nom || "",
          address: data.Adresse1 || "",
          postal_code: data.CP || "",
          city: data.Ville || "",
          country: data.Pays || "FR",
        };

        setRelayPoint(point);
      },
    });
  }

  async function handleRemove(productId) {
    try {
      await removeFromCart(productId);
      await loadCart();

      if (typeof refreshCartCount === "function") {
        await refreshCartCount();
      }
    } catch (err) {
      alert(err.message || "Impossible de supprimer le produit");
    }
  }

  async function handleClear() {
    try {
      await clearCart();
      setCart([]);
      setRelayPoint(null);

      if (typeof refreshCartCount === "function") {
        await refreshCartCount();
      }
    } catch (err) {
      alert(err.message || "Impossible de vider le panier");
    }
  }

  async function handleCheckout() {
    try {
      setCheckoutLoading(true);

      const token = getToken();

      if (!token) {
        throw new Error("Vous devez être connecté pour payer.");
      }

      if (shippingMethod === "relay" && !relayPoint) {
        throw new Error("Veuillez sélectionner un point relais Mondial Relay.");
      }

      const orderData = await createOrder({
        shippingMethod,
        relayPoint: shippingMethod === "relay" ? relayPoint : null,
      });

      const orderId = orderData?.order?.id;

      if (!orderId) {
        throw new Error("Commande invalide.");
      }

      const stripeResponse = await fetch(
        buildApiUrl("/stripe/create-checkout-session"),
        {
          method: "POST",
          headers: getCheckoutHeaders(),
          body: JSON.stringify({ orderId }),
        }
      );

      if (!stripeResponse.ok) {
        throw new Error(
          await parseError(stripeResponse, "Erreur session Stripe")
        );
      }

      const stripeData = await stripeResponse.json();

      if (!stripeData?.url) {
        throw new Error("URL Stripe introuvable.");
      }

      window.location.href = stripeData.url;
    } catch (err) {
      alert(err.message || "Erreur paiement");
    } finally {
      setCheckoutLoading(false);
    }
  }

  if (loading) {
    return <div className="page-message">Chargement du panier...</div>;
  }

  if (error) {
    return <div className="page-message error">{error}</div>;
  }

  return (
    <main className="page">
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

          <section
            className="order-card"
            style={{
              marginTop: "24px",
              border: freeShipping
                ? "1px solid rgba(88, 128, 88, 0.35)"
                : "1px solid rgba(155, 111, 111, 0.16)",
            }}
          >
            {freeShipping ? (
              <p style={{ margin: 0 }}>
                🎁 <strong>Livraison offerte</strong> : votre panier dépasse{" "}
                {formatPrice(FREE_SHIPPING_THRESHOLD)}.
              </p>
            ) : (
              <p style={{ margin: 0 }}>
                🎁 Encore{" "}
                <strong>{formatPrice(remainingForFreeShipping)}</strong> pour
                bénéficier de la livraison offerte.
              </p>
            )}
          </section>

          <section className="order-card" style={{ marginTop: "24px" }}>
            <h2>Mode de livraison</h2>

            {SHIPPING_OPTIONS.map((option) => (
              <label
                key={option.method}
                style={{
                  display: "block",
                  padding: "14px",
                  marginBottom: "10px",
                  border: "1px solid rgba(155, 111, 111, 0.16)",
                  borderRadius: "16px",
                  cursor: "pointer",
                  background:
                    shippingMethod === option.method
                      ? "rgba(255, 255, 255, 0.7)"
                      : "transparent",
                }}
              >
                <input
                  type="radio"
                  name="shippingMethod"
                  value={option.method}
                  checked={shippingMethod === option.method}
                  onChange={() => handleShippingChange(option.method)}
                  style={{ marginRight: "10px" }}
                />

                <strong>{option.label}</strong> —{" "}
                {freeShipping ? (
                  <>
                    <span style={{ textDecoration: "line-through" }}>
                      {formatPrice(option.price)}
                    </span>{" "}
                    <strong>0.00 €</strong>
                  </>
                ) : (
                  formatPrice(option.price)
                )}
                <br />
                <span style={{ color: "#655350" }}>{option.description}</span>
              </label>
            ))}

            {shippingMethod === "relay" && (
              <div
                style={{
                  marginTop: "18px",
                  padding: "16px",
                  border: "1px solid rgba(155, 111, 111, 0.16)",
                  borderRadius: "16px",
                  background: "rgba(255, 255, 255, 0.55)",
                }}
              >
                <h3>Point relais Mondial Relay</h3>

                <p>
                  Sélectionnez le point relais où vous souhaitez recevoir votre
                  commande.
                </p>

                <button
                  type="button"
                  className="product-detail__button"
                  onClick={handleOpenRelayWidget}
                >
                  Choisir un point relais
                </button>

                <div id="relay-widget" style={{ marginTop: "16px" }} />

                {relayPoint && (
                  <div
                    style={{
                      marginTop: "16px",
                      padding: "14px",
                      border: "1px solid rgba(155, 111, 111, 0.16)",
                      borderRadius: "16px",
                      background: "#fff",
                    }}
                  >
                    <p>
                      <strong>Point relais sélectionné :</strong>
                    </p>
                    <p>
                      <strong>{relayPoint.name}</strong>
                    </p>
                    <p>{relayPoint.address}</p>
                    <p>
                      {relayPoint.postal_code} {relayPoint.city}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="order-card" style={{ marginTop: "24px" }}>
            <p>
              <strong>Sous-total produits :</strong>{" "}
              {formatPrice(productsTotal)}
            </p>

            <p>
              <strong>Livraison :</strong>{" "}
              {freeShipping ? "Offerte" : formatPrice(shippingTotal)}
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
    </main>
  );
}