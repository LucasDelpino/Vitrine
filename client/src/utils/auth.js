const USER_KEY = "auth_user";
const TOKEN_KEY = "auth_token";

export function saveAuth(user, token) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
}

export function getUser() {
  const rawUser = localStorage.getItem(USER_KEY);
  return rawUser ? JSON.parse(rawUser) : null;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeAuth() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}