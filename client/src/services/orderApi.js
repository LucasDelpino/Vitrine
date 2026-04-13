import { getToken } from "../utils/auth.js";

const API_URL = "http://localhost:3000/api/orders";

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

export async function createOrder() {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Impossible de créer la commande");
  }

  return data;
}

export async function fetchMyOrders() {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Impossible de récupérer les commandes");
  }

  return data;
}

export async function fetchOrderById(orderId) {
  const response = await fetch(`${API_URL}/${orderId}`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Impossible de récupérer la commande");
  }

  return data;
}

export async function fetchOrderItems(orderId) {
  const response = await fetch(`${API_URL}/${orderId}/items`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Impossible de récupérer les produits");
  }

  return data;
}