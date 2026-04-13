import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-card__media">
        <img
          className="product-card__image"
          src={product.image_url}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src = "http://localhost:3000/uploads/default.jpg";
          }}
        />

        {product.images?.length > 1 && (
          <span className="product-card__photos-badge">
            {product.images.length} photos
          </span>
        )}
      </div>

      <div className="product-card__body">
        <h2 className="product-card__title">{product.name}</h2>
        <p className="product-card__description">{product.description}</p>

        <div className="product-card__footer">
          <p className="product-card__price">{product.price} €</p>

          <Link className="product-card__link" to={`/product/${product.id}`}>
            Voir
          </Link>
        </div>
      </div>
    </article>
  );
}