import { getToken } from "../utils/auth.js";

const API_URL = "http://localhost:3000/api/admin";

export async function uploadAdminProductImage(productId, file) {
  const token = getToken();
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_URL}/products/${productId}/images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Impossible d'envoyer l'image");
  }

  return data;
}