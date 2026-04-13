import { useEffect, useState } from "react";
import { fetchMe, updateMe } from "../services/authApi.js";
import { getToken, saveAuth } from "../utils/auth.js";

export default function Profile() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await fetchMe();
        setForm({
          nom: user.nom || "",
          prenom: user.prenom || "",
          email: user.email || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const data = await updateMe(form);
      saveAuth(data.user, getToken());
      setMessage("Informations mises à jour avec succès");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p className="page-message">Chargement...</p>;
  }

  return (
    <main className="page">
      <section className="auth-card">
        <h1>Mon profil</h1>

        {error && <p className="page-message error">{error}</p>}
        {message && <p className="page-message success">{message}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            value={form.prenom}
            onChange={handleChange}
          />

          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={form.nom}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <button className="product-detail__button" type="submit">
            Enregistrer
          </button>
        </form>
      </section>
    </main>
  );
}