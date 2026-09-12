// Minimal token storage. For a 2-day scope, localStorage is the pragmatic
// choice - an httpOnly cookie set by the backend would be more secure
// against XSS, but that's a deliberate corner cut for now.

const TOKEN_KEY = "taskflow_token";
const USERNAME_KEY = "taskflow_username";

export function setAuth(token: string, username: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsername(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USERNAME_KEY);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}
