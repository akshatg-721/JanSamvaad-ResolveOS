import type { ApiEnvelopeDTO, JsonRecord, PaginatedResponseDTO } from "@/lib/contracts/common";
import type { ComplaintDTO, ComplaintLocationDTO } from "@/lib/contracts/complaint";

function asRecord(value: unknown): JsonRecord {
  return typeof value === "object" && value !== null ? (value as JsonRecord) : {};
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function asNullableString(value: unknown): string | null {
  const text = asString(value, "").trim();
  return text ? text : null;
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function asNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = asNumber(value, Number.NaN);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeStatus(value: unknown): string {
  return asString(value, "OPEN").trim().replaceAll("-", "_").toUpperCase() || "OPEN";
}

function normalizeSeverity(rawSeverity: unknown, priority: number): string {
  const severity = asString(rawSeverity, "").trim();
  if (severity) {
    const upper = severity.toUpperCase();
    if (upper === "CRITICAL") return "Critical";
    if (upper === "HIGH") return "High";
    if (upper === "MEDIUM") return "Medium";
    if (upper === "LOW") return "Low";
    return severity;
  }
  if (priority >= 3) return "Critical";
  if (priority === 2) return "High";
  if (priority === 1) return "Medium";
  return "Low";
}

function mapLocation(value: unknown): ComplaintLocationDTO | null {
  const record = asRecord(value);
  if (Object.keys(record).length === 0) return null;
  return {
    address: asNullableString(record.address),
    city: asNullableString(record.city),
    state: asNullableString(record.state),
    pincode: asNullableString(record.pincode),
    lat: record.lat != null ? asNullableNumber(record.lat) : asNullableNumber(record.latitude),
    lng: record.lng != null ? asNullableNumber(record.lng) : asNullableNumber(record.longitude),
  };
}

function buildRef(id: string, rawRef: unknown): string {
  const direct = asString(rawRef).trim();
  if (direct) return direct;
  return `JS-${id.slice(-6).toUpperCase()}`;
}

export function mapComplaint(input: unknown, index = 0): ComplaintDTO {
  const raw = asRecord(input);
  const id = asString(raw.id, `tmp-${index}`);
  const priority = asNumber(raw.priority, asNumber(raw.severityScore, 0));

  const upvoteCount = asNumber(raw.upvoteCount, asNumber(raw.upvotes, asNumber(asRecord(raw._count).upvotes, 0)));
  const commentCount = asNumber(raw.commentCount, asNumber(raw.comments, asNumber(asRecord(raw._count).comments, 0)));
  const attachmentCount = asNumber(raw.attachmentCount, asNumber(asRecord(raw._count).attachments, 0));

  return {
    id,
    ref: buildRef(id, raw.ref ?? raw.reference),
    title: asString(raw.title || raw.summary, "Untitled complaint"),
    description: asString(raw.description || raw.summary, ""),
    category: asString(raw.category, "OTHER"),
    status: normalizeStatus(raw.status),
    severity: normalizeSeverity(raw.severity, priority),
    priority,
    wardId: raw.ward_id != null ? asNumber(raw.ward_id, 0) : raw.wardId != null ? asNumber(raw.wardId, 0) : null,
    wardName: asNullableString(raw.ward_name || raw.wardName || asRecord(raw.location).address),
    location: mapLocation(raw.location),
    createdAt: asString(raw.createdAt || raw.created_at, new Date().toISOString()),
    updatedAt: asNullableString(raw.updatedAt || raw.updated_at),
    upvoteCount,
    commentCount,
    attachmentCount,
    citizenPhone: asNullableString(raw.phone || raw.citizenPhone),
    evidenceUrl: asNullableString(raw.evidence_url || raw.evidenceUrl),
    raw,
  };
}

export function mapComplaintList(input: unknown): ComplaintDTO[] {
  if (Array.isArray(input)) return input.map((item, index) => mapComplaint(item, index));
  const envelope = asRecord(input) as ApiEnvelopeDTO<unknown>;
  if (Array.isArray(envelope.data)) return envelope.data.map((item, index) => mapComplaint(item, index));
  return [];
}

export function mapComplaintsPage(input: unknown, defaultLimit = 20): PaginatedResponseDTO<ComplaintDTO> {
  const envelope = asRecord(input) as ApiEnvelopeDTO<unknown>;
  const items = mapComplaintList(input);
  const pagination = asRecord(envelope.pagination);
  const page = asNumber(pagination.page, 1);
  const limit = asNumber(pagination.limit, defaultLimit);
  const total = asNumber(pagination.total, items.length);
  const totalPages = asNumber(pagination.totalPages, Math.max(1, Math.ceil(total / Math.max(1, limit))));
  const hasMore = Boolean(pagination.hasMore ?? page < totalPages);

  return { items, page, limit, total, totalPages, hasMore };
}
