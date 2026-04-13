import { getToken } from "../utils/auth.js";

export async function uploadAdminProductImage(productId, file) {
  const token = getToken();
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `http://localhost:3000/api/admin/products/${productId}/images`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const text = await response.text();
  console.log("UPLOAD RAW RESPONSE =", text);

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Réponse serveur non JSON : ${text.slice(0, 120)}`);
  }

  if (!response.ok) {
    throw new Error(data.error || "Erreur lors de l'upload de l'image");
  }

  return data;
}