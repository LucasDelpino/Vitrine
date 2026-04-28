import { useEffect, useState } from "react";
import {
  fetchAdminOrders,
  updateAdminOrderStatus,
} from "../services/adminOrderApi.js";

const STATUS_OPTIONS = [
  { value: "pending", label: "En attente" },
  { value: "paid", label: "Confirmée" },
  { value: "shipped", label: "Expédiée" },
  { value: "cancelled", label: "Annulée" },
];

const DEFAULT_TRACKING_URLS = {
  home: "https://www.laposte.fr/outils/suivre-vos-envois?code=",
  relay: "https://www.mondialrelay.fr/suivi-de-colis/?numeroExpedition=",
};

function formatOrderStatus(status) {
  const labels = {
    pending: "En attente",
    paid: "Confirmée",
    shipped: "Expédiée",
    cancelled: "Annulée",
  };

  return labels[status] || status || "Inconnu";
}

function formatPaymentStatus(status) {
  const labels = {
    unpaid: "Non payé",
    pending: "En attente",
    paid: "Payé",
    refunded: "Remboursé",
    failed: "Échoué",
  };

  return labels[status] || status || "Inconnu";
}

function formatPrice(value) {
  return `${Number(value || 0).toFixed(2)} €`;
}

function isRelayOrder(order) {
  return order.shipping_method === "relay";
}

function isHomeOrder(order) {
  return order.shipping_method === "home";
}

function buildDefaultTrackingUrl(order, trackingNumber = "") {
  const baseUrl = isRelayOrder(order)
    ? DEFAULT_TRACKING_URLS.relay
    : DEFAULT_TRACKING_URLS.home;

  return trackingNumber ? `${baseUrl}${trackingNumber}` : baseUrl;
}

function getRelaySummary(order) {
  const parts = [
    order.relay_point_name,
    order.relay_point_address,
    [order.relay_point_postal_code, order.relay_point_city]
      .filter(Boolean)
      .join(" "),
    order.relay_point_country,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" - ") : "Point relais non renseigné";
}

function getHomeAddressSummary(order) {
  const parts = [
    order.shipping_address_line1,
    [order.shipping_postal_code, order.shipping_city].filter(Boolean).join(" "),
    order.shipping_country,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" - ") : "Adresse non renseignée";
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [trackingDrafts, setTrackingDrafts] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchAdminOrders();
      const safeOrders = Array.isArray(data) ? data : [];

      setOrders(safeOrders);

      const drafts = {};
      safeOrders.forEach((order) => {
        const trackingNumber = order.tracking_number || "";

        drafts[order.id] = {
          trackingNumber,
          trackingUrl:
            order.tracking_url || buildDefaultTrackingUrl(order, trackingNumber),
        };
      });

      setTrackingDrafts(drafts);
    } catch (err) {
      setError(err.message || "Impossible de charger les commandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleTrackingChange = (order, field, value) => {
    setTrackingDrafts((prev) => {
      const current = prev[order.id] || {
        trackingNumber: "",
        trackingUrl: buildDefaultTrackingUrl(order),
      };

      if (field === "trackingNumber") {
        return {
          ...prev,
          [order.id]: {
            trackingNumber: value,
            trackingUrl: buildDefaultTrackingUrl(order, value),
          },
        };
      }

      return {
        ...prev,
        [order.id]: {
          ...current,
          [field]: value,
        },
      };
    });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setError("");
      setMessage("");
      setUpdatingOrderId(orderId);

      const tracking = trackingDrafts[orderId] || {};

      await updateAdminOrderStatus(orderId, {
        status: newStatus,
        trackingNumber: tracking.trackingNumber || "",
        trackingUrl: tracking.trackingUrl || "",
      });

      setMessage("Commande mise à jour avec succès.");
      await loadOrders();
    } catch (err) {
      setError(err.message || "Impossible de mettre à jour la commande");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleOpenTracking = (trackingUrl) => {
    if (!trackingUrl) return;
    window.open(trackingUrl, "_blank", "noopener,noreferrer");
  };

  const handleOpenShippingTool = (order) => {
    if (isRelayOrder(order)) {
      window.open(
        "https://www.mondialrelay.fr/",
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    window.open(
      "https://www.laposte.fr/mon-timbre-en-ligne",
      "_blank",
      "noopener,noreferrer"
    );
  };

  if (loading) {
    return (
      <main className="page">
        <h1>Administration des commandes</h1>
        <p>Chargement des commandes...</p>
      </main>
    );
  }

  return (
    <main className="page">
      <h1>Administration des commandes</h1>

      {error && <p className="page-message error">{error}</p>}
      {message && <p className="product-detail__message">{message}</p>}

      <div className="orders-list">
        {orders.length === 0 && <p>Aucune commande trouvée.</p>}

        {orders.map((order) => {
          const draft = trackingDrafts[order.id] || {
            trackingNumber: "",
            trackingUrl: buildDefaultTrackingUrl(order),
          };

          const updating = updatingOrderId === order.id;
          const relayOrder = isRelayOrder(order);
          const homeOrder = isHomeOrder(order);

          return (
            <article key={order.id} className="order-card">
              <p>
                <strong>Référence :</strong> {order.sale_reference}
              </p>

              <p>
                <strong>Client :</strong> {order.prenom} {order.nom}
              </p>

              <p>
                <strong>Email :</strong> {order.email}
              </p>

              {homeOrder && (
                <div
                  style={{
                    margin: "12px 0",
                    padding: "14px",
                    border: "1px solid rgba(155, 111, 111, 0.16)",
                    borderRadius: "16px",
                    background: "rgba(255, 255, 255, 0.55)",
                  }}
                >
                  <p>
                    <strong>Adresse de livraison domicile :</strong>
                  </p>
                  <p>
                    {order.shipping_address_line1 || "Adresse non renseignée"}
                  </p>
                  <p>
                    {[order.shipping_postal_code, order.shipping_city]
                      .filter(Boolean)
                      .join(" ") || "Ville non renseignée"}
                  </p>
                  <p>{order.shipping_country || "FR"}</p>
                  <p style={{ marginTop: "8px" }}>
                    <strong>Résumé :</strong> {getHomeAddressSummary(order)}
                  </p>
                </div>
              )}

              <p>
                <strong>Sous-total :</strong> {formatPrice(order.subtotal)}
              </p>

              <p>
                <strong>Livraison :</strong>{" "}
                {order.shipping_label || "Non renseigné"} —{" "}
                {Number(order.shipping_amount) === 0
                  ? "Offerte"
                  : formatPrice(order.shipping_amount)}
              </p>

              {relayOrder && (
                <div
                  style={{
                    margin: "12px 0",
                    padding: "14px",
                    border: "1px solid rgba(155, 111, 111, 0.16)",
                    borderRadius: "16px",
                    background: "rgba(255, 255, 255, 0.55)",
                  }}
                >
                  <p>
                    <strong>Point relais Mondial Relay :</strong>
                  </p>

                  <p>
                    <strong>Identifiant :</strong>{" "}
                    {order.relay_point_id || "Non renseigné"}
                  </p>

                  <p>
                    <strong>Nom :</strong>{" "}
                    {order.relay_point_name || "Non renseigné"}
                  </p>

                  <p>
                    <strong>Adresse :</strong>{" "}
                    {order.relay_point_address || "Non renseignée"}
                  </p>

                  <p>
                    <strong>Ville :</strong>{" "}
                    {[order.relay_point_postal_code, order.relay_point_city]
                      .filter(Boolean)
                      .join(" ") || "Non renseignée"}
                  </p>

                  <p>
                    <strong>Pays :</strong> {order.relay_point_country || "FR"}
                  </p>

                  <p style={{ marginTop: "8px" }}>
                    <strong>Résumé :</strong> {getRelaySummary(order)}
                  </p>
                </div>
              )}

              <p>
                <strong>Total :</strong> {formatPrice(order.total)}
              </p>

              <p>
                <strong>Paiement :</strong>{" "}
                {formatPaymentStatus(order.payment_status)}
              </p>

              <p>
                <strong>Statut actuel :</strong>{" "}
                {formatOrderStatus(order.status)}
              </p>

              <div className="auth-form" style={{ marginTop: "12px" }}>
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() => handleOpenShippingTool(order)}
                >
                  {relayOrder
                    ? "Ouvrir Mondial Relay"
                    : "Préparer l’envoi La Poste"}
                </button>

                <input
                  type="text"
                  placeholder={
                    relayOrder
                      ? "Numéro de suivi Mondial Relay"
                      : "Numéro de suivi La Poste"
                  }
                  value={draft.trackingNumber}
                  onChange={(e) =>
                    handleTrackingChange(order, "trackingNumber", e.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder={
                    relayOrder
                      ? "Lien de suivi Mondial Relay"
                      : "Lien de suivi La Poste"
                  }
                  value={draft.trackingUrl}
                  onChange={(e) =>
                    handleTrackingChange(order, "trackingUrl", e.target.value)
                  }
                />

                {draft.trackingUrl && (
                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={() => handleOpenTracking(draft.trackingUrl)}
                  >
                    Ouvrir le suivi
                  </button>
                )}

                <label>
                  Nouveau statut :
                  <select
                    value={order.status}
                    disabled={updating}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    style={{ marginLeft: "10px" }}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </label>

                {updating && <p>Mise à jour en cours...</p>}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}