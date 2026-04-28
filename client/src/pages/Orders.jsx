import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyOrders } from "../services/orderApi.js";

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

function formatShipping(order) {
  if (order.shipping_method === "relay") {
    const relayName = order.relay_point_name || "Point relais non renseigné";
    const relayCity = [order.relay_point_postal_code, order.relay_point_city]
      .filter(Boolean)
      .join(" ");

    return `Mondial Relay : ${relayName}${relayCity ? ` - ${relayCity}` : ""}`;
  }

  const address = order.shipping_address_line1 || "Adresse non renseignée";
  const city = [order.shipping_postal_code, order.shipping_city]
    .filter(Boolean)
    .join(" ");

  return `À domicile : ${address}${city ? ` - ${city}` : ""}`;
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="page-message">Chargement des commandes...</p>;
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
        <p>Vous n&apos;avez encore passé aucune commande.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article key={order.id} className="order-card">
              <p>
                <strong>Référence :</strong> {order.sale_reference}
              </p>

              <p>
                <strong>Statut :</strong> {formatOrderStatus(order.status)}
              </p>

              <p>
                <strong>Paiement :</strong>{" "}
                {formatPaymentStatus(order.payment_status)}
              </p>

              <p>
                <strong>Total :</strong> {formatPrice(order.total)}
              </p>

              <p>
                <strong>Livraison :</strong> {formatShipping(order)}
              </p>

              <p>
                <strong>Date :</strong>{" "}
                {new Date(order.created_at).toLocaleDateString("fr-FR")}
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