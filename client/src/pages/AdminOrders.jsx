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

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [trackingDrafts, setTrackingDrafts] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadOrders = async () => {
    try {
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
    }
  };

  return (
    <main className="page">
      <h1>Administration des commandes</h1>

      {error && <p className="page-message error">{error}</p>}
      {message && <p className="product-detail__message">{message}</p>}

      <div className="orders-list">
        {orders.map((order) => {
          const draft = trackingDrafts[order.id] || {
            trackingNumber: "",
            trackingUrl: "",
          };

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

              <p>
                <strong>Sous-total :</strong> {formatPrice(order.subtotal)}
              </p>

              <p>
                <strong>Livraison :</strong>{" "}
                {order.shipping_label || "Non renseigné"} —{" "}
                {formatPrice(order.shipping_amount)}
              </p>

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
                  placeholder="Numéro de suivi"
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
                  placeholder="Lien de suivi"
                  value={draft.trackingUrl}
                  onChange={(e) =>
                    handleTrackingChange(order.id, "trackingUrl", e.target.value)
                  }
                />

                <label>
                  Nouveau statut :
                  <select
                    value={order.status}
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
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}