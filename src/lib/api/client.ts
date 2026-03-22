import { buildApiUrl } from "@/lib/api/config";
import { getSessionToken } from "@/lib/auth/session";
import type { ApiEnvelopeDTO } from "@/lib/contracts/common";

export class ApiClientError extends Error {
  status?: number;
  code?: string;
  details?: unknown;

  constructor(message: string, options?: { status?: number; code?: string; details?: unknown }) {
    super(message);
    this.name = "ApiClientError";
    this.status = options?.status;
    this.code = options?.code;
    this.details = options?.details;
  }
}

type Primitive = string | number | boolean;
type QueryValue = Primitive | null | undefined;

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
  query?: Record<string, QueryValue>;
}

function toQueryString(query?: Record<string, QueryValue>): string {
  if (!query) return "";
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    params.set(key, String(value));
  });
  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

function shouldSerializeBody(body: unknown): body is Record<string, unknown> {
  if (body === null || body === undefined) return false;
  if (typeof FormData !== "undefined" && body instanceof FormData) return false;
  if (typeof Blob !== "undefined" && body instanceof Blob) return false;
  if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) return false;
  return typeof body === "object";
}

function extractErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const record = payload as Record<string, unknown>;
  if (typeof record.error === "string" && record.error.trim() !== "") return record.error;
  if (typeof record.message === "string" && record.message.trim() !== "") return record.message;
  if (record.error && typeof record.error === "object") {
    const nested = record.error as Record<string, unknown>;
    if (typeof nested.message === "string" && nested.message.trim() !== "") return nested.message;
  }
  return fallback;
}

function dispatchUnauthorized(status?: number): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("unauthorized", {
      detail: { type: "unauthorized", status },
    })
  );
}

export async function requestJson<T = unknown>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { auth = true, query, body, headers, ...rest } = options;
  const token = auth ? getSessionToken() : null;
  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string> | undefined),
  };

  if (token) finalHeaders.Authorization = `Bearer ${token}`;

  const hasSerializableBody = shouldSerializeBody(body);
  let requestBody: BodyInit | undefined;
  if (hasSerializableBody) {
    if (!finalHeaders["Content-Type"]) finalHeaders["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  } else {
    requestBody = body as BodyInit | undefined;
  }

  const url = buildApiUrl(path) + toQueryString(query);
  const response = await fetch(url, {
    ...rest,
    headers: finalHeaders,
    body: requestBody,
  });

  const rawText = await response.text();
  let payload: unknown = null;
  try {
    payload = rawText ? JSON.parse(rawText) : null;
  } catch {
    payload = rawText || null;
  }

  if (!response.ok) {
    const message = extractErrorMessage(payload, `Request failed (${response.status})`);
    if (response.status === 401 || response.status === 403) {
      dispatchUnauthorized(response.status);
    }
    throw new ApiClientError(message, { status: response.status, details: payload });
  }

  if (payload && typeof payload === "object") {
    const envelope = payload as ApiEnvelopeDTO<unknown>;
    if (envelope.success === false) {
      const message = extractErrorMessage(payload, "Request failed");
      throw new ApiClientError(message, { status: response.status, details: payload });
    }
  }

  return payload as T;
}
