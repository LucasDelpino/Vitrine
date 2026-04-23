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
  return `${Number(value).toFixed(2)} €`;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadOrders = async () => {
    try {
      const data = await fetchAdminOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setError("");
      setMessage("");
      await updateAdminOrderStatus(orderId, newStatus);
      setMessage("Statut mis à jour avec succès.");
      await loadOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="page">
      <h1>Administration des commandes</h1>

      {error && <p className="page-message error">{error}</p>}
      {message && <p className="product-detail__message">{message}</p>}

      <div className="orders-list">
        {orders.map((order) => (
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
              <strong>Total :</strong> {formatPrice(order.total)}
            </p>

            <p>
              <strong>Paiement :</strong>{" "}
              {formatPaymentStatus(order.payment_status)}
            </p>

            <p>
              <strong>Statut actuel :</strong> {formatOrderStatus(order.status)}
            </p>

            <label>
              Nouveau statut :
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                style={{ marginLeft: "10px" }}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
          </article>
        ))}
      </div>
    </main>
  );
}