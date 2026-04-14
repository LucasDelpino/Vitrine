export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export const API_URL = `${API_BASE_URL}/api`;

export function buildApiUrl(path) {
  return `${API_URL}${path}`;
}

export function buildUploadUrl(path = "") {
  if (!path) return `${API_BASE_URL}/uploads/default.jpg`;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/uploads")) {
    return `${API_BASE_URL}${path}`;
  }

  if (path.startsWith("uploads/")) {
    return `${API_BASE_URL}/${path}`;
  }

  return `${API_BASE_URL}/uploads/${path}`;
}