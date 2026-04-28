import { getToken } from "../utils/auth.js";
import { buildApiUrl } from "../config/api.js";

const API_URL = buildApiUrl("/orders");

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function parseJson(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || fallbackMessage);
  }

  return data;
}

export async function createOrder({ shippingMethod, relayPoint = null }) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      shippingMethod,
      relayPoint,
    }),
  });

  return parseJson(response, "Impossible de créer la commande");
}

export async function fetchMyOrders() {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });

  return parseJson(response, "Impossible de récupérer les commandes");
}

export async function fetchOrderById(orderId) {
  const response = await fetch(`${API_URL}/${orderId}`, {
    headers: getAuthHeaders(),
  });

  return parseJson(response, "Impossible de récupérer la commande");
}

export async function fetchOrderItems(orderId) {
  const response = await fetch(`${API_URL}/${orderId}/items`, {
    headers: getAuthHeaders(),
  });

  return parseJson(response, "Impossible de récupérer les produits");
}