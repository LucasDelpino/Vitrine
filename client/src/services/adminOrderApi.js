import { getToken } from "../utils/auth.js";

const API_URL = "http://localhost:3000/api/admin";

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

export async function fetchAdminOrders() {
  const response = await fetch(`${API_URL}/orders`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Impossible de récupérer les commandes");
  }

  return data;
}

export async function updateAdminOrderStatus(orderId, status) {
  const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Impossible de mettre à jour le statut");
  }

  return data;
}