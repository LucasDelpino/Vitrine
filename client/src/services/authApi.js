import { getToken } from "../utils/auth.js";
import { buildApiUrl } from "../config/api.js";

const API_URL = buildApiUrl("/auth");

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erreur de connexion");
  }

  return data;
}

export async function registerUser({ nom, prenom, email, password }) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nom, prenom, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erreur d'inscription");
  }

  return data;
}

export async function fetchMe() {
  const token = getToken();

  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Impossible de récupérer le profil");
  }

  return data;
}

export async function updateMe(profile) {
  const token = getToken();

  const response = await fetch(`${API_URL}/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Impossible de mettre à jour le profil");
  }

  return data;
}