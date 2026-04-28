import { getToken } from "../utils/auth.js";
import { buildApiUrl } from "../config/api.js";

const API_URL = buildApiUrl("/admin");

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

export async function fetchAdminOrders() {
  const response = await fetch(`${API_URL}/orders`, {
    headers: getAuthHeaders(),
  });

  return parseJson(response, "Impossible de récupérer les commandes");
}

export async function updateAdminOrderStatus(
  orderId,
  { status, trackingNumber = "", trackingUrl = "" }
) {
  const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      status,
      trackingNumber,
      trackingUrl,
    }),
  });

  return parseJson(response, "Impossible de mettre à jour le statut");
}