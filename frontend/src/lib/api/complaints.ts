import type {
  ComplaintDTO,
  ComplaintQueryParamsDTO,
  ResolutionFeedbackPayloadDTO,
} from "@/lib/contracts/complaint";
import type { PaginatedResponseDTO } from "@/lib/contracts/common";
import { apiFetch } from "@/api/client";

interface MainTicketRecord {
  id: number | string;
  ref: string;
  category?: string | null;
  ward_id?: number | null;
  ward_name?: string | null;
  severity?: string | null;
  status?: string | null;
  created_at?: string | null;
  evidence_url?: string | null;
  phone?: string | null;
  geo_address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  translated_text?: string | null;
}

function toString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function normalizeStatus(value: string): string {
  const normalized = value.toLowerCase();
  if (normalized === "in-progress" || normalized === "in_progress") return "IN_PROGRESS";
  if (normalized === "resolved") return "RESOLVED";
  if (normalized === "closed") return "CLOSED";
  return "OPEN";
}

function normalizeSeverity(value: string): string {
  const normalized = value.toUpperCase();
  if (normalized === "CRITICAL") return "Critical";
  if (normalized === "HIGH") return "High";
  if (normalized === "MEDIUM") return "Medium";
  return "Low";
}

function severityPriority(severity: string): number {
  const normalized = severity.toLowerCase();
  if (normalized === "critical") return 3;
  if (normalized === "high") return 2;
  if (normalized === "medium") return 1;
  return 0;
}

function mapComplaint(item: MainTicketRecord): ComplaintDTO {
  const id = toString(item.id);
  const severity = normalizeSeverity(toString(item.severity, "Medium"));
  const wardId = item.ward_id == null ? null : toNumber(item.ward_id, 0);
  const wardName = toString(item.ward_name, wardId ? `Ward ${wardId}` : "Unassigned");

  const lat = item.latitude == null ? null : toNumber(item.latitude, Number.NaN);
  const lng = item.longitude == null ? null : toNumber(item.longitude, Number.NaN);

  return {
    id,
    ref: toString(item.ref, `JS-${id}`),
    title: toString(item.category, "General grievance"),
    description: toString(item.translated_text, toString(item.category, "No description available")),
    category: toString(item.category, "General"),
    status: normalizeStatus(toString(item.status, "open")),
    severity,
    priority: severityPriority(severity),
    wardId,
    wardName,
    location: {
      address: toString(item.geo_address, wardName),
      lat: Number.isFinite(lat) ? lat : null,
      lng: Number.isFinite(lng) ? lng : null,
    },
    createdAt: toString(item.created_at, new Date().toISOString()),
    updatedAt: null,
    upvoteCount: 0,
    commentCount: 0,
    attachmentCount: item.evidence_url ? 1 : 0,
    citizenPhone: item.phone ? String(item.phone) : null,
    evidenceUrl: item.evidence_url ? String(item.evidence_url) : null,
  };
}

function applyFilters(items: ComplaintDTO[], query?: ComplaintQueryParamsDTO): ComplaintDTO[] {
  let filtered = items;

  if (query?.status && query.status !== "all") {
    const status = query.status.replace("-", "_").toUpperCase();
    filtered = filtered.filter((item) => item.status.toUpperCase() === status);
  }

  if (query?.severity && query.severity !== "all") {
    const severity = query.severity.toLowerCase();
    filtered = filtered.filter((item) => String(item.severity).toLowerCase() === severity);
  }

  if (query?.category && query.category !== "all") {
    const category = query.category.toLowerCase();
    filtered = filtered.filter((item) => item.category.toLowerCase() === category);
  }

  if (query?.search) {
    const q = query.search.toLowerCase().trim();
    filtered = filtered.filter((item) =>
      item.ref.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.wardName || "").toLowerCase().includes(q)
    );
  }

  return filtered;
}

export async function getComplaints(
  query?: ComplaintQueryParamsDTO
): Promise<PaginatedResponseDTO<ComplaintDTO>> {
  const response = await apiFetch<MainTicketRecord[]>("/api/tickets");
  const mapped = (response || []).map(mapComplaint);
  const filtered = applyFilters(mapped, query);

  const page = query?.page && query.page > 0 ? query.page : 1;
  const limit = query?.limit && query.limit > 0 ? query.limit : 20;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return {
    items,
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
  };
}

export async function submitTicketResolutionFeedback(
  ticketId: string,
  payload: ResolutionFeedbackPayloadDTO
): Promise<void> {
  const response = await fetch(`/api/tickets/${ticketId}/resolve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorText = `Failed to submit feedback (${response.status})`;
    try {
      const data = (await response.json()) as { error?: string; message?: string };
      errorText = data.error || data.message || errorText;
    } catch {
      // keep fallback error text
    }
    throw new Error(errorText);
  }
}
