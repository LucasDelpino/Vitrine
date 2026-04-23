import { getToken } from "../utils/auth.js";
import { buildApiUrl } from "../config/api.js";

const API_URL = buildApiUrl("/auth");

async function parseJson(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Erreur serveur");
  }

  return data;
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return parseJson(response);
}

export async function login(email, password) {
  return loginUser(email, password);
}

export async function registerUser({
  nom,
  prenom,
  email,
  password,
  confirmPassword,
}) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nom,
      prenom,
      email,
      password,
      confirmPassword,
    }),
  });

  return parseJson(response);
}

export async function register(payload) {
  return registerUser(payload);
}

export async function forgotPassword(email) {
  const response = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return parseJson(response);
}

export async function resetPassword(token, password) {
  const response = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, password }),
  });

  return parseJson(response);
}

export async function fetchMe() {
  const token = getToken();

  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseJson(response);
}

export async function getMe() {
  return fetchMe();
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

  return parseJson(response);
}