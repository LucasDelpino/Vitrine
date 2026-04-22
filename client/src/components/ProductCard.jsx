import { Link } from "react-router-dom";
import { buildUploadUrl } from "../config/api.js";

export default function ProductCard({ product }) {
  const productImages = Array.isArray(product.images) ? product.images : [];

  const imageUrl =
    productImages.length > 0
      ? buildUploadUrl(productImages[0].image_url)
      : buildUploadUrl(product.image_url);

  const imageCount = productImages.length > 0 ? productImages.length : 1;

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card__media">
        <img
          className="product-card__image"
          src={imageUrl}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src = buildUploadUrl();
          }}
        />
        <span className="product-card__photos-badge">
          {imageCount} photo{imageCount > 1 ? "s" : ""}
        </span>
      </Link>

      <div className="product-card__body">
        <h3 className="product-card__title">{product.name}</h3>

        <p className="product-card__description">
          {product.description || "Création artisanale aux lignes délicates."}
        </p>

        <div className="product-card__footer">
          <p className="product-card__price">
            {Number(product.price).toFixed(2)} €
          </p>

          <Link to={`/product/${product.id}`} className="product-card__link">
            Voir
          </Link>
        </div>
      </div>
    </article>
  );
}