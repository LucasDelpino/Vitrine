import { useEffect, useState } from "react";
import {
  fetchAdminOrders,
  updateAdminOrderStatus
} from "../services/adminOrderApi.js";

const STATUSES = ["pending", "paid", "shipped", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadOrders = async () => {
    try {
      const data = await fetchAdminOrders();
      setOrders(data);
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
      setMessage("Statut mis à jour");
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
            <p><strong>Réf :</strong> {order.sale_reference}</p>
            <p><strong>Client :</strong> {order.prenom} {order.nom}</p>
            <p><strong>Email :</strong> {order.email}</p>
            <p><strong>Total :</strong> {order.total} €</p>
            <p><strong>Paiement :</strong> {order.payment_status}</p>
            <p><strong>Statut actuel :</strong> {order.status}</p>

            <label>
              Nouveau statut :
              <select
                value={order.status}
                onChange={(e) =>
                  handleStatusChange(order.id, e.target.value)
                }
                style={{ marginLeft: "10px" }}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
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