import type { UserDTO } from "@/lib/contracts/user";

const TOKEN_KEY = "resolveos.auth.token";
const USER_KEY = "resolveos.auth.user";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getSessionToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setSessionToken(token: string): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearSessionToken(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(TOKEN_KEY);
}

export function getSessionUser(): UserDTO | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserDTO;
  } catch {
    return null;
  }
}

export function setSessionUser(user: UserDTO | null): void {
  if (!isBrowser()) return;
  if (!user) {
    window.localStorage.removeItem(USER_KEY);
    return;
  }
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSessionUser(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(USER_KEY);
}

export function clearFrontendSession(): void {
  clearSessionToken();
  clearSessionUser();
}

export function hasFrontendSession(): boolean {
  return Boolean(getSessionToken() || getSessionUser());
}
