import { useEffect, useState } from "react";
import { fetchMe, updateMe } from "../services/authApi.js";
import { searchAddresses } from "../services/addressApi.js";
import { getToken, saveAuth } from "../utils/auth.js";

export default function Profile() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    phone: "",
    address: "",
    postal_code: "",
    city: "",
    country: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);

  // Très important :
  // false = ne pas relancer l'autocomplete tant que l'utilisateur
  // n'a pas retapé lui-même dans le champ adresse
  const [canSearchAddress, setCanSearchAddress] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await fetchMe();

        setForm({
          nom: user.nom || "",
          prenom: user.prenom || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          postal_code: user.postal_code || "",
          city: user.city || "",
          country: user.country || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    if (!canSearchAddress) {
      return;
    }

    const query = form.address.trim();

    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsSearchingAddress(true);
        const results = await searchAddresses(query);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (err) {
        console.error("Erreur recherche adresse :", err);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsSearchingAddress(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [form.address, canSearchAddress]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "address") {
      // L'utilisateur retape : on réactive l'autocomplete
      setCanSearchAddress(true);

      if (value.trim().length >= 3) {
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  const handleSelectAddress = (item) => {
    setForm((prev) => ({
      ...prev,
      address: item.address,
      postal_code: item.postal_code,
      city: item.city,
      country: item.country,
    }));

    // On ferme définitivement la liste
    setSuggestions([]);
    setShowSuggestions(false);

    // Et surtout on bloque toute nouvelle recherche
    // tant que l'utilisateur ne retouche pas le champ
    setCanSearchAddress(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setShowSuggestions(false);

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

          <input
            type="text"
            name="phone"
            placeholder="Téléphone"
            value={form.phone}
            onChange={handleChange}
          />

          <div style={{ position: "relative" }}>
            <input
              type="text"
              name="address"
              placeholder="Adresse"
              value={form.address}
              onChange={handleChange}
              autoComplete="off"
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 150);
              }}
              onFocus={() => {
                if (
                  canSearchAddress &&
                  suggestions.length > 0 &&
                  form.address.trim().length >= 3
                ) {
                  setShowSuggestions(true);
                }
              }}
            />

            {isSearchingAddress && canSearchAddress && (
              <div style={{ marginTop: "6px", fontSize: "0.9rem" }}>
                Recherche d&apos;adresse...
              </div>
            )}

            {showSuggestions && suggestions.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  marginTop: "6px",
                  overflow: "hidden",
                  zIndex: 20,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                }}
              >
                {suggestions.map((item, index) => (
                  <button
                    key={`${item.label}-${index}`}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectAddress(item)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "12px 14px",
                      border: "none",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            type="text"
            name="postal_code"
            placeholder="Code postal"
            value={form.postal_code}
            onChange={handleChange}
          />

          <input
            type="text"
            name="city"
            placeholder="Ville"
            value={form.city}
            onChange={handleChange}
          />

          <input
            type="text"
            name="country"
            placeholder="Pays"
            value={form.country}
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