import { apiFetch } from "@/api/client";
import type {
  DashboardActivityDTO,
  DashboardAnalyticsDTO,
  DashboardStatsDTO,
  TicketLedgerDTO,
} from "@/lib/contracts/dashboard";

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
}

interface MainStatsResponse {
  open?: number;
  closed?: number;
  breach_risk?: number;
  slaHitRate?: string;
}

interface MainAnalyticsResponse {
  wardStats?: Array<{
    ward?: string;
    slaRate?: number;
    avgResolutionHrs?: string | number;
    citizenSatisfaction?: number;
  }>;
  categoryTrend?: Array<{
    cat?: string;
    count?: number;
    color?: string;
  }>;
  slaPerformance?: Array<{
    week?: string;
    onTime?: number;
    breached?: number;
  }>;
}

interface MainActivityResponse {
  id?: string | number;
  type?: string;
  message?: string;
  time?: string;
  isAlert?: boolean;
  phone?: string;
}

const CATEGORY_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#06b6d4",
];

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

function toTitleSeverity(value: string): string {
  const normalized = value.toUpperCase();
  if (normalized === "CRITICAL") return "Critical";
  if (normalized === "HIGH") return "High";
  if (normalized === "MEDIUM") return "Medium";
  return "Low";
}

function normalizeActivityType(value: string): DashboardActivityDTO["type"] {
  const normalized = value.toLowerCase();
  if (normalized === "voice") return "voice";
  if (normalized === "escalation") return "escalation";
  if (normalized === "verify") return "verify";
  if (normalized === "alert") return "alert";
  if (normalized === "sms") return "sms";
  if (normalized === "ai") return "ai";
  return "system";
}

function mapTicket(item: MainTicketRecord): TicketLedgerDTO {
  return {
    id: toString(item.id),
    ref: toString(item.ref, "JS-UNKNOWN"),
    category: toString(item.category, "General"),
    wardId: item.ward_id == null ? null : toNumber(item.ward_id, 0),
    severity: toTitleSeverity(toString(item.severity, "Medium")),
    status: toString(item.status, "open"),
    createdAt: toString(item.created_at, new Date().toISOString()),
    phone: item.phone ? String(item.phone) : null,
    evidenceUrl: item.evidence_url ? String(item.evidence_url) : null,
  };
}

export async function getDashboardStats(): Promise<DashboardStatsDTO> {
  const response = await apiFetch<MainStatsResponse>("/api/stats");
  return {
    open: toNumber(response?.open, 0),
    closed: toNumber(response?.closed, 0),
    breachRisk: toNumber(response?.breach_risk, 0),
    slaHitRate: toString(response?.slaHitRate, "0%"),
  };
}

export async function getDashboardActivity(): Promise<DashboardActivityDTO[]> {
  const response = await apiFetch<MainActivityResponse[]>("/api/activity");
  return (response || []).map((item, idx) => ({
    id: toString(item?.id, `activity-${idx}`),
    type: normalizeActivityType(toString(item?.type, "system")),
    message: toString(item?.message, "System event"),
    time: toString(item?.time, "--:--"),
    isAlert: Boolean(item?.isAlert),
    phone: item?.phone ? String(item.phone) : undefined,
  }));
}

export async function getDashboardAnalytics(): Promise<DashboardAnalyticsDTO> {
  const response = await apiFetch<MainAnalyticsResponse>("/api/analytics");

  const wardStats = (response?.wardStats || []).map((row) => ({
    ward: toString(row?.ward, "Ward Unknown"),
    slaRate: toNumber(row?.slaRate, 0),
    avgResolutionHrs: toNumber(row?.avgResolutionHrs, 0),
    citizenSatisfaction: toNumber(row?.citizenSatisfaction, 0),
  }));

  const categoryTrend = (response?.categoryTrend || []).map((row, index) => ({
    cat: toString(row?.cat, "Other"),
    count: toNumber(row?.count, 0),
    color: toString(row?.color, CATEGORY_COLORS[index % CATEGORY_COLORS.length]),
  }));

  const slaPerformance = (response?.slaPerformance || []).map((row) => ({
    week: toString(row?.week, "W-0"),
    onTime: toNumber(row?.onTime, 0),
    breached: toNumber(row?.breached, 0),
  }));

  return { wardStats, categoryTrend, slaPerformance };
}

export async function getTickets(query?: {
  limit?: number;
  status?: string;
}): Promise<TicketLedgerDTO[]> {
  const response = await apiFetch<MainTicketRecord[]>("/api/tickets");
  let items = (response || []).map(mapTicket);

  if (query?.status) {
    const target = query.status.toLowerCase();
    items = items.filter((item) => item.status.toLowerCase() === target);
  }

  if (query?.limit && query.limit > 0) {
    items = items.slice(0, query.limit);
  }

  return items;
}

export async function createTicket(payload: {
  phone: string;
  category: string;
  ward_id: number;
  severity: string;
}): Promise<void> {
  await apiFetch("/api/tickets", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function generateTicketQr(ticketId: string): Promise<{ token: string }> {
  const response = await apiFetch<{ token?: string }>(`/api/tickets/${ticketId}/generate-qr`, {
    method: "POST",
  });
  return { token: toString(response?.token) };
}
