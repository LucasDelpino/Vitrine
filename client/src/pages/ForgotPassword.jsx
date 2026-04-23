import { useState } from "react";
import { forgotPassword } from "../services/authApi.js";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);
      const data = await forgotPassword(email);
      setMessage(
        data.message ||
          "Si le compte existe, un email de réinitialisation a été envoyé."
      );
      setEmail("");
    } catch (err) {
      setError(err.message || "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page auth-page">
      <div className="auth-card">
        <h1>Mot de passe oublié</h1>
        <p>
          Saisissez votre adresse email pour recevoir un lien de
          réinitialisation.
        </p>

        {message && <p className="product-detail__message">{message}</p>}
        {error && <p className="error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="product-detail__button" disabled={loading}>
            {loading ? "Envoi..." : "Envoyer le lien"}
          </button>
        </form>

        <br />

        <Link to="/login" className="back-link">
          Retour à la connexion
        </Link>
      </div>
    </main>
  );
}