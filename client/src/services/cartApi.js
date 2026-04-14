import { getToken } from "../utils/auth.js";
import { buildApiUrl } from "../config/api.js";

const API_URL = buildApiUrl("/cart");

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchCart() {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer le panier");
  }

  return response.json();
}

export async function addProductToCart(productId, quantity = 1) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ productId, quantity }),
  });

  if (!response.ok) {
    throw new Error("Impossible d'ajouter au panier");
  }

  return response.json();
}

export async function removeProductFromCart(productId) {
  const response = await fetch(`${API_URL}/${productId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Impossible de supprimer");
  }

  return response.json();
}

export async function clearCartApi() {
  const response = await fetch(API_URL, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Impossible de vider");
  }

  return response.json();
}