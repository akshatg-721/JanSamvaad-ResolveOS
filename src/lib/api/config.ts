function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

const envBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "";

const envSocketUrl =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "";

export const API_CONFIG = {
  baseUrl: trimTrailingSlash(envBaseUrl),
  socketUrl: trimTrailingSlash(envSocketUrl),
  authMode: (process.env.NEXT_PUBLIC_AUTH_MODE || "token") as "token" | "session",
  enableDevFallbacks: process.env.NEXT_PUBLIC_DEV_MOCKS === "true",
};

export function buildApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_CONFIG.baseUrl}${normalizedPath}`;
}
