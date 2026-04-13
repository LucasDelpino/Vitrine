import { getToken } from "../utils/auth.js";

const API_URL = "http://localhost:3000/api/admin";

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

export async function fetchAdminProducts() {
  const response = await fetch(`${API_URL}/products`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Impossible de récupérer les produits");
  }

  return data;
}

export async function createAdminProduct(product) {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(product)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Impossible de créer le produit");
  }

  return data;
}

export async function updateAdminProduct(id, product) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(product)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Impossible de modifier le produit");
  }

  return data;
}

export async function deleteAdminProduct(id) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Impossible de supprimer le produit");
  }

  return data;
}