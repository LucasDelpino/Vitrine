import { getToken } from "../utils/auth.js";

const API_URL = "http://localhost:3000/api/admin/products";

export async function uploadAdminProductImage(productId, file) {
  const token = getToken();
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_URL}/${productId}/images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erreur lors de l'upload de l'image");
  }

  return data;
}

export async function deleteAdminProductImage(imageId) {
  const token = getToken();

  const response = await fetch(`${API_URL}/images/${imageId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erreur lors de la suppression de l'image");
  }

  return data;
}

export async function setPrimaryAdminProductImage(productId, imageId) {
  const token = getToken();

  const response = await fetch(`${API_URL}/${productId}/images/${imageId}/primary`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Erreur lors de la définition de l'image principale"
    );
  }

  return data;
}