import { ApiClientError, requestJson } from "@/lib/api/client";
import { loginRequest } from "@/lib/api/auth";
import {
  clearSessionToken,
  getSessionToken,
  setSessionToken,
  setSessionUser,
} from "@/lib/auth/session";

export class UnauthorizedError extends ApiClientError {
  constructor(message = "Unauthorized") {
    super(message, { status: 401 });
    this.name = "UnauthorizedError";
  }
}

export function getToken(): string | null {
  return getSessionToken();
}

export function setToken(token: string): void {
  setSessionToken(token);
}

export function clearToken(): void {
  clearSessionToken();
}

export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  try {
    return await requestJson<T>(path, {
      ...options,
      body: options.body,
      headers: options.headers,
      auth: true,
    });
  } catch (error) {
    if (error instanceof ApiClientError && (error.status === 401 || error.status === 403)) {
      clearToken();
      throw new UnauthorizedError(error.message);
    }
    throw error instanceof Error ? error : new Error("Network error occurred");
  }
}

export async function login(username: string, password: string): Promise<void> {
  const session = await loginRequest({ username, email: username, password });
  if (!session.token) {
    throw new Error("Authentication response did not include a token.");
  }
  setSessionToken(session.token);
  if (session.user) setSessionUser(session.user);
}

