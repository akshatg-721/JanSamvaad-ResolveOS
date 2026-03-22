import type { AuthSessionDTO, UserDTO } from "@/lib/contracts/user";
import type { ApiEnvelopeDTO, JsonRecord } from "@/lib/contracts/common";

function asRecord(value: unknown): JsonRecord {
  return typeof value === "object" && value !== null ? (value as JsonRecord) : {};
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

export function mapUser(input: unknown): UserDTO | null {
  if (!input) return null;
  const raw = asRecord(input);
  const id = asString(raw.id, "");
  const email = asString(raw.email, "");
  if (!id && !email) return null;

  return {
    id: id || email,
    name: asString(raw.name, asString(raw.username, "Operator")),
    email,
    phone: asString(raw.phone, "") || null,
    role: asString(raw.role, "USER"),
    avatar: asString(raw.avatar, "") || null,
  };
}

export function mapAuthSession(input: unknown): AuthSessionDTO {
  const envelope = asRecord(input) as ApiEnvelopeDTO<unknown>;
  const source = asRecord(envelope.data ?? input);
  return {
    token: asString(source.token, ""),
    user: mapUser(source.user ?? source.account ?? source.profile),
    expiresAt: asString(source.expiresAt ?? source.expires, "") || null,
  };
}
