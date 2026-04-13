import { getToken } from "../utils/auth.js";

const API_URL = "http://localhost:3000/api/stripe";

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

export async function createStripeCheckoutSession(orderId) {
  const response = await fetch(`${API_URL}/checkout-session`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ orderId })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Impossible de créer la session Stripe");
  }

  return data;
}