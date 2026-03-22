import { API_CONFIG } from "@/lib/api/config";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiClientError, requestJson } from "@/lib/api/client";
import type { AuthSessionDTO, LoginPayloadDTO, RegisterPayloadDTO, UserDTO } from "@/lib/contracts/user";
import { mapAuthSession } from "@/lib/mappers/user.mapper";

type MockAccount = {
  email: string;
  name: string;
  role: UserDTO["role"];
  password: string;
};

const DEV_MOCK_ACCOUNTS: Record<string, MockAccount> = {
  "admin@jansamvaad.gov.in": {
    email: "admin@jansamvaad.gov.in",
    name: "Admin User",
    role: "ADMIN",
    password: "Admin@123456",
  },
  "official@jansamvaad.gov.in": {
    email: "official@jansamvaad.gov.in",
    name: "Rajesh Kumar",
    role: "OFFICIAL",
    password: "Admin@123456",
  },
  "rahul@example.com": {
    email: "rahul@example.com",
    name: "Rahul Sharma",
    role: "USER",
    password: "User@123456",
  },
};

function canUseDevFallback(error: unknown): boolean {
  if (!API_CONFIG.enableDevFallbacks) return false;
  if (!(error instanceof ApiClientError)) return true;
  return error.status === 404 || error.status === 405 || error.status === 500 || error.status === undefined;
}

function normalizeIdentifier(payload: LoginPayloadDTO): string {
  return String(payload.username || payload.email || "").trim().toLowerCase();
}

function buildGenericDevUser(identifier: string): UserDTO {
  const email = identifier.includes("@") ? identifier : `${identifier || "operator"}@local.dev`;
  const nameBase = identifier.includes("@") ? identifier.split("@")[0] : identifier;
  const name = nameBase ? nameBase.charAt(0).toUpperCase() + nameBase.slice(1) : "Operator";
  return {
    id: `dev-${email}`,
    name,
    email,
    role: "OFFICIAL",
    phone: null,
    avatar: null,
  };
}

function buildDevMockSession(payload: LoginPayloadDTO): AuthSessionDTO {
  const identifier = normalizeIdentifier(payload);
  const password = String(payload.password || "");
  if (!identifier || !password) {
    throw new Error("Operator ID and security key are required.");
  }

  const knownAccount = DEV_MOCK_ACCOUNTS[identifier];
  if (knownAccount && password !== knownAccount.password) {
    throw new Error("Invalid operator ID or security key.");
  }

  const user: UserDTO =
    knownAccount
      ? {
          id: `dev-${knownAccount.email}`,
          name: knownAccount.name,
          email: knownAccount.email,
          role: knownAccount.role,
          phone: null,
          avatar: null,
        }
      : buildGenericDevUser(identifier);

  return {
    token: `dev-mock-token-${user.id}`,
    user,
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
  };
}

export async function loginRequest(payload: LoginPayloadDTO): Promise<AuthSessionDTO> {
  try {
    const response = await requestJson<unknown>(API_ENDPOINTS.auth.login, {
      method: "POST",
      auth: false,
      body: payload,
    });
    return mapAuthSession(response);
  } catch (error) {
    if (canUseDevFallback(error)) {
      return buildDevMockSession(payload);
    }
    throw error;
  }
}

export async function logoutRequest(): Promise<void> {
  try {
    await requestJson<unknown>(API_ENDPOINTS.auth.logout, {
      method: "POST",
      auth: true,
    });
  } catch {
    // Frontend logout should not hard fail if backend logout endpoint is absent.
  }
}

export async function registerRequest(payload: RegisterPayloadDTO): Promise<AuthSessionDTO> {
  try {
    const response = await requestJson<unknown>(API_ENDPOINTS.auth.register, {
      method: "POST",
      auth: false,
      body: payload,
    });
    return mapAuthSession(response);
  } catch (error) {
    if (canUseDevFallback(error)) {
      const user: UserDTO = {
        id: `dev-${payload.email}`,
        name: payload.name || "Operator",
        email: payload.email,
        role: "USER",
        phone: payload.phone || null,
        avatar: null,
      };
      return {
        token: `dev-mock-token-${user.id}`,
        user,
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      };
    }
    throw error;
  }
}

export async function fetchAuthSession(): Promise<AuthSessionDTO> {
  try {
    const response = await requestJson<unknown>(API_ENDPOINTS.auth.session, {
      method: "GET",
      auth: true,
    });
    return mapAuthSession(response);
  } catch (error) {
    if (canUseDevFallback(error)) {
      return {};
    }
    throw error;
  }
}
