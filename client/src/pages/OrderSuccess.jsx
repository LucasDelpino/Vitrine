import { Link, useLocation } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sessionId = params.get("session_id");

  return (
    <main className="page">
      <h1>Commande confirmée</h1>

      <p>
        Merci pour votre achat. Votre paiement a bien été pris en compte et
        votre commande a été enregistrée.
      </p>

      {sessionId && (
        <p>
          <strong>Référence de session Stripe :</strong> {sessionId}
        </p>
      )}

      <p>
        Vous pouvez consulter le suivi de votre commande dans l’espace
        <strong> Mes commandes</strong>.
      </p>

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