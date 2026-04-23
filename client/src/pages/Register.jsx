import { useState } from "react";
import { register } from "../services/authApi";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Vérif mot de passe sécurisé
    if (!passwordRegex.test(form.password)) {
      return setError(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
      );
    }

    // Vérif confirmation
    if (form.password !== form.confirmPassword) {
      return setError("Les mots de passe ne correspondent pas.");
    }

    try {
      await register({
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      alert("Votre inscription est validée, vous pouvez vous connecter !");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Inscription</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          name="nom"
          placeholder="Nom"
          value={form.nom}
          onChange={handleChange}
          required
        />

        <input
          name="prenom"
          placeholder="Prénom"
          value={form.prenom}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          required
        />

        <small style={{ fontSize: "12px", color: "#666" }}>
          8 caractères minimum, avec majuscule, minuscule, chiffre et caractère spécial
        </small>

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirmer le mot de passe"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit">Créer un compte</button>

        <p onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>
          Déjà inscrit ? Se connecter
        </p>
      </form>
    </div>
  );
}