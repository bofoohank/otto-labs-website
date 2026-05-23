import type { User } from "@/types/user";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function getToken() {
  if (typeof window === "undefined") return "";

  return localStorage.getItem(TOKEN_KEY) || "";
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;

  const savedUser = localStorage.getItem(USER_KEY);

  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser) as User;
  } catch {
    clearSession();
    return null;
  }
}

export function saveSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function saveStoredUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}