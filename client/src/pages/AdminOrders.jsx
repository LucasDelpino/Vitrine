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
        drafts[order.id] = {
          trackingNumber: order.tracking_number || "",
          trackingUrl: order.tracking_url || "",
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

  const handleTrackingChange = (orderId, field, value) => {
    setTrackingDrafts((prev) => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || {}),
        [field]: value,
      },
    }));
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
            trackingUrl: "",
          };

          const updating = updatingOrderId === order.id;
          const relayOrder = isRelayOrder(order);

          return (
            <article key={order.id} className="order-card">
              <p>
                <strong>Référence :</strong> {order.sale_reference}
              </p>

              <p>
                <strong>Client :</strong> {order.prenom} {order.nom}
              </p>

              {order.shipping_method === "home" && order.shipping_address_line1 && (
                <div style={{ marginTop: "10px" }}>
                  <strong>Adresse livraison :</strong><br />
                  {order.shipping_address_line1}<br />
                  {order.shipping_postal_code} {order.shipping_city}<br />
                  {order.shipping_country}
                </div>
              )}

              <p>
                <strong>Email :</strong> {order.email}
              </p>

              <p>
                <strong>Sous-total :</strong> {formatPrice(order.subtotal)}
              </p>

              <p>
                <strong>Livraison :</strong>{" "}
                {order.shipping_label || "Non renseigné"} —{" "}
                {formatPrice(order.shipping_amount)}
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
                    <strong>Pays :</strong>{" "}
                    {order.relay_point_country || "FR"}
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
                <input
                  type="text"
                  placeholder={
                    relayOrder
                      ? "Numéro de suivi Mondial Relay"
                      : "Numéro de suivi"
                  }
                  value={draft.trackingNumber}
                  onChange={(e) =>
                    handleTrackingChange(
                      order.id,
                      "trackingNumber",
                      e.target.value
                    )
                  }
                />

                <input
                  type="text"
                  placeholder={
                    relayOrder
                      ? "Lien de suivi Mondial Relay"
                      : "Lien de suivi"
                  }
                  value={draft.trackingUrl}
                  onChange={(e) =>
                    handleTrackingChange(
                      order.id,
                      "trackingUrl",
                      e.target.value
                    )
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