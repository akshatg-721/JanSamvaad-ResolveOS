import { clearToken, getToken, login as loginWithPassword } from "@/api/client";

interface LoginPayload {
  username?: string;
  email?: string;
  password: string;
}

export async function login(payload: LoginPayload): Promise<void> {
  const identifier = String(payload.username || payload.email || "").trim();
  if (!identifier || !payload.password) {
    throw new Error("Operator ID and security key are required.");
  }
  await loginWithPassword(identifier, payload.password);
}

export function requireFrontendAuth(): boolean {
  return Boolean(getToken());
}

export function logout(): void {
  clearToken();
}
