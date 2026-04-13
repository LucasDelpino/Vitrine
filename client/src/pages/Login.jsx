import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authApi.js";
import { saveAuth } from "../utils/auth.js";

export default function Login({ refreshUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const data = await loginUser(form.email, form.password);
      saveAuth(data.user, data.token);
      refreshUser();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="page auth-page">
      <div className="auth-card">
        <h1>Connexion</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
          />

          <button className="product-detail__button" type="submit">
            Se connecter
          </button>
        </form>

        {error && <p className="page-message error">{error}</p>}

        <p>
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </p>
      </div>
    </main>
  );
}