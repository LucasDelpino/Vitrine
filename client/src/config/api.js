const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const normalizedApiUrl = rawApiUrl.endsWith("/")
  ? rawApiUrl.slice(0, -1)
  : rawApiUrl;

const hasApiSuffix = normalizedApiUrl.endsWith("/api");

export const API_BASE_URL = hasApiSuffix
  ? normalizedApiUrl.slice(0, -4)
  : normalizedApiUrl;

export const API_URL = hasApiSuffix
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api`;

export function buildApiUrl(path = "") {
  const safePath = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${safePath}`;
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