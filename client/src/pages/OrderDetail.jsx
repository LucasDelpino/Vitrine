import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchOrderById, fetchOrderItems } from "../services/orderApi.js";
import { buildUploadUrl } from "../config/api.js";

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

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchOrderById(id), fetchOrderItems(id)])
      .then(([orderData, itemsData]) => {
        setOrder(orderData);
        setItems(Array.isArray(itemsData) ? itemsData : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="page-message">Chargement de la commande...</p>;
  }

  if (error) {
    return (
      <main className="page">
        <p className="page-message error">{error}</p>
        <Link className="back-link" to="/orders">
          Retour aux commandes
        </Link>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="page">
        <p className="page-message error">Commande introuvable.</p>
        <Link className="back-link" to="/orders">
          Retour aux commandes
        </Link>
      </main>
    );
  }

  return (
    <main className="page">
      <Link className="back-link" to="/orders">
        ← Retour aux commandes
      </Link>

      <h1>Détail de la commande</h1>

      <div className="order-card">
        <p>
          <strong>Référence :</strong> {order.sale_reference}
        </p>
        <p>
          <strong>Statut :</strong> {formatOrderStatus(order.status)}
        </p>
        <p>
          <strong>Paiement :</strong> {formatPaymentStatus(order.payment_status)}
        </p>
        <p>
          <strong>Total :</strong> {formatPrice(order.total)}
        </p>
        <p>
          <strong>Date :</strong>{" "}
          {order.created_at
            ? new Date(order.created_at).toLocaleDateString("fr-FR")
            : "Date inconnue"}
        </p>
      </div>

      <h2>Articles de la commande</h2>

      <div className="orders-list">
        {items.map((item) => (
          <article key={item.id} className="order-item-card">
            {item.product_image && (
              <img
                className="order-item-card__image"
                src={buildUploadUrl(item.product_image)}
                alt={item.product_name}
                onError={(e) => {
                  e.currentTarget.src = buildUploadUrl();
                }}
              />
            )}

            <div>
              <h3>{item.product_name}</h3>
              <p>
                <strong>Quantité :</strong> {item.quantity}
              </p>
              <p>
                <strong>Prix unitaire :</strong> {formatPrice(item.unit_price)}
              </p>
              <p>
                <strong>Total ligne :</strong> {formatPrice(item.line_total)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}