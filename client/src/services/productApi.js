import { buildApiUrl } from "../config/api.js";

export async function fetchProducts() {
  const response = await fetch(buildApiUrl("/products"), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Impossible de charger les produits");
  }

  return response.json();
}

export async function fetchProductById(productId) {
  const response = await fetch(buildApiUrl(`/products/${productId}`), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Produit introuvable");
  }

  return response.json();
}