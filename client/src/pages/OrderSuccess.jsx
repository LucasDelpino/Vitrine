import { Link, useLocation } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <main className="page">
      <h1>Commande confirmée</h1>

      {order ? (
        <>
          <p>Merci pour votre commande.</p>
          <p>
            Référence : <strong>{order.sale_reference}</strong>
          </p>
          <p>Total : {order.total} €</p>
        </>
      ) : (
        <p>Aucune information de commande trouvée.</p>
      )}

      <br />

      <Link className="back-link" to="/">
        Retour à la boutique
      </Link>

      <br />
      <br />

      <Link className="back-link" to="/orders">
        Voir mes commandes
      </Link>
    </main>
  );
}