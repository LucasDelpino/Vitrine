import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyOrders } from "../services/orderApi.js";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders()
      .then((data) => setOrders(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="page-message">Chargement...</p>;
  }

  if (error) {
    return (
      <main className="page">
        <p className="page-message error">{error}</p>
      </main>
    );
  }

  return (
    <main className="page">
      <h1>Mes commandes</h1>

      {orders.length === 0 ? (
        <p>Vous n'avez encore passé aucune commande.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article key={order.id} className="order-card">
              <p>
                <strong>Référence :</strong> {order.sale_reference}
              </p>
              <p>
                <strong>Statut :</strong> {order.status}
              </p>
              <p>
                <strong>Paiement :</strong> {order.payment_status}
              </p>
              <p>
                <strong>Total :</strong> {order.total} €
              </p>
              <p>
                <strong>Date :</strong>{" "}
                {new Date(order.created_at).toLocaleDateString()}
              </p>

              <Link className="product-card__link" to={`/orders/${order.id}`}>
                Voir le détail
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}