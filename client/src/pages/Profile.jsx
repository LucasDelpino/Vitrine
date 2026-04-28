import { useEffect, useRef, useState } from "react";
import { getMe, updateMe } from "../services/authApi.js";

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

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setError("");
        const data = await getMe();

        setForm({
          nom: data.nom || "",
          prenom: data.prenom || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          postal_code: data.postal_code || "",
          city: data.city || "",
          country: data.country || "",
        });
      } catch (err) {
        setError(err.message || "Impossible de charger le profil");
      }
    }

    loadProfile();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function fetchAddressSuggestions(query) {
    if (!query || query.trim().length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setLoadingSuggestions(true);

      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
          query
        )}&limit=5`
      );

      const data = await response.json();

      const suggestions = Array.isArray(data.features)
        ? data.features.map((feature) => ({
            label: feature.properties.label || "",
            name: feature.properties.name || "",
            postcode: feature.properties.postcode || "",
            city: feature.properties.city || "",
            country: "France",
          }))
        : [];

      setAddressSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } catch (err) {
      console.error("Erreur suggestions adresse :", err);
      setAddressSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoadingSuggestions(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "address") {
      setShowSuggestions(false);
      setAddressSuggestions([]);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        fetchAddressSuggestions(value);
      }, 300);
    }
  }

  function handleSelectSuggestion(suggestion) {
    setForm((prev) => ({
      ...prev,
      address: suggestion.name,
      postal_code: suggestion.postcode,
      city: suggestion.city,
      country: suggestion.country || "France",
    }));

    setAddressSuggestions([]);
    setShowSuggestions(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      const result = await updateMe(form);

      setMessage("Informations mises à jour avec succès");

      if (result?.user) {
        setForm({
          nom: result.user.nom || "",
          prenom: result.user.prenom || "",
          email: result.user.email || "",
          phone: result.user.phone || "",
          address: result.user.address || "",
          postal_code: result.user.postal_code || "",
          city: result.user.city || "",
          country: result.user.country || "",
        });
      }
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour");
    }
  }

  return (
    <main className="page">
      <div className="auth-card">
        <h1>Mon profil</h1>

        {message && <p className="product-detail__message">{message}</p>}
        {error && <p className="error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={form.nom}
            onChange={handleChange}
            autoComplete="family-name"
          />

          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            value={form.prenom}
            onChange={handleChange}
            autoComplete="given-name"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />

          <input
            type="text"
            name="phone"
            placeholder="Téléphone"
            value={form.phone}
            onChange={handleChange}
            autoComplete="tel"
          />

          <div ref={containerRef} style={{ position: "relative" }}>
            <input
              type="text"
              name="address"
              placeholder="Adresse"
              value={form.address}
              onChange={handleChange}
              onFocus={() => {
                if (addressSuggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              autoComplete="street-address"
            />

            {loadingSuggestions && form.address.trim().length >= 3 && (
              <div
                style={{
                  marginTop: "6px",
                  fontSize: "0.9rem",
                  color: "#7a6661",
                }}
              >
                Recherche d’adresses...
              </div>
            )}

            {showSuggestions && addressSuggestions.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 20,
                  background: "#fffdf9",
                  border: "1px solid rgba(155, 111, 111, 0.16)",
                  borderRadius: "16px",
                  boxShadow: "0 12px 24px rgba(66, 41, 41, 0.08)",
                  marginTop: "6px",
                  overflow: "hidden",
                }}
              >
                {addressSuggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.label}-${index}`}
                    type="button"
                    onClick={() => handleSelectSuggestion(suggestion)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "12px 14px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      borderBottom:
                        index !== addressSuggestions.length - 1
                          ? "1px solid rgba(155, 111, 111, 0.08)"
                          : "none",
                    }}
                  >
                    {suggestion.label}
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
            autoComplete="postal-code"
          />

          <input
            type="text"
            name="city"
            placeholder="Ville"
            value={form.city}
            onChange={handleChange}
            autoComplete="address-level2"
          />

          <input
            type="text"
            name="country"
            placeholder="Pays"
            value={form.country}
            onChange={handleChange}
            autoComplete="country-name"
          />

          <button type="submit" className="product-detail__button">
            Modifier mes informations
          </button>
        </form>
      </div>
    </main>
  );
}