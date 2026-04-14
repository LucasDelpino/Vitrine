import { Link, useNavigate } from "react-router-dom";
import { removeAuth } from "../utils/auth.js";

export default function Header({ cartCount, user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAuth();
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-header__logo" to="/">
          Nelegance
        </Link>

        <nav className="site-header__nav">
          <Link className="site-header__link" to="/">
            Boutique
          </Link>

          <Link className="site-header__cart" to="/cart">
            <span>Panier</span>
            <span className="site-header__badge">{cartCount}</span>
          </Link>

          {user ? (
            <>
              <Link className="site-header__link" to="/profile">
                Mon profil
              </Link>
              
              <Link className="site-header__link" to="/orders">
                Commandes
              </Link>

              {user?.role && user.role.toLowerCase() === "admin" && (
                <>
                <Link className="site-header__link" to="/admin/orders">
                  Commandes clients
                </Link>

                <Link className="site-header__link" to="/admin/products">
                  Produits
                </Link>
              </>
              )}

              <span className="site-header__user">
                {user.prenom} {user.nom}
              </span>

              <button
                type="button"
                className="site-header__logout"
                onClick={handleLogout}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link className="site-header__link" to="/login">
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}