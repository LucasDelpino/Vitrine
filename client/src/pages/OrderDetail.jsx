import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchOrderById, fetchOrderItems } from "../services/orderApi.js";

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
        setItems(itemsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="page-message">Chargement...</p>;
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
          <strong>Statut :</strong> {order.status}
        </p>
        <p>
          <strong>Paiement :</strong> {order.payment_status}
        </p>
        <p>
          <strong>Total :</strong> {order.total} €
        </p>
      </div>

      <h2>Produits</h2>

      <div className="orders-list">
        {items.map((item) => (
          <article key={item.id} className="order-item-card">
            {item.product_image && (
              <img
                className="order-item-card__image"
                src={`http://localhost:3000/uploads/${item.product_image}`}
                alt={item.product_name}
                onError={(e) => {
                  e.currentTarget.src =
                    "http://localhost:3000/uploads/default.jpg";
                }}
              />
            )}

            <div>
              <h3>{item.product_name}</h3>
              <p>Quantité : {item.quantity}</p>
              <p>Prix unitaire : {item.unit_price} €</p>
              <p>Total ligne : {item.line_total} €</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}