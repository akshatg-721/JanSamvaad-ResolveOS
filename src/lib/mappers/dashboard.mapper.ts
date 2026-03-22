import type {
  DashboardActivityDTO,
  DashboardAnalyticsDTO,
  DashboardStatsDTO,
  TicketLedgerDTO,
} from "@/lib/contracts/dashboard";
import type { ApiEnvelopeDTO, JsonRecord } from "@/lib/contracts/common";

function asRecord(value: unknown): JsonRecord {
  return typeof value === "object" && value !== null ? (value as JsonRecord) : {};
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function mapDashboardStats(input: unknown): DashboardStatsDTO {
  const envelope = asRecord(input) as ApiEnvelopeDTO<unknown>;
  const raw = asRecord(envelope.data ?? input);

  const open = asNumber(raw.open, asNumber(raw.total_open, asNumber(raw.pendingComplaints, asNumber(raw.pending, 0))));
  const closed = asNumber(raw.closed, asNumber(raw.total_closed, asNumber(raw.resolvedComplaints, asNumber(raw.resolved, 0))));
  const pending = asNumber(raw.pending, asNumber(raw.pendingComplaints, open));
  const resolved = asNumber(raw.resolved, asNumber(raw.resolvedComplaints, closed));
  const breachRisk = asNumber(raw.breachRisk, asNumber(raw.breach_risk, 0));
  const slaRate =
    asString(raw.slaHitRate, "") ||
    `${Math.round(asNumber(raw.resolutionRate, asNumber(raw.slaRate, 0)))}%`;

  return {
    open,
    closed,
    pending,
    resolved,
    breachRisk,
    slaHitRate: slaRate || "0%",
  };
}

export function mapTicketLedger(input: unknown, index = 0): TicketLedgerDTO {
  const raw = asRecord(input);
  const id = asString(raw.id, `ticket-${index}`);
  return {
    id,
    ref: asString(raw.ref, `JS-${id.slice(-6).toUpperCase()}`),
    category: asString(raw.category, "General"),
    wardId: raw.ward_id != null ? asNumber(raw.ward_id, 0) : raw.wardId != null ? asNumber(raw.wardId, 0) : null,
    severity: asString(raw.severity, "Medium"),
    status: asString(raw.status, "open"),
    createdAt: asString(raw.createdAt || raw.created_at, new Date().toISOString()),
    phone: asString(raw.phone, "") || null,
    evidenceUrl: asString(raw.evidence_url || raw.evidenceUrl, "") || null,
  };
}

export function mapTicketLedgerList(input: unknown): TicketLedgerDTO[] {
  const envelope = asRecord(input) as ApiEnvelopeDTO<unknown>;
  const list = asArray(envelope.data ?? input);
  return list.map((item, index) => mapTicketLedger(item, index));
}

export function mapDashboardActivity(input: unknown): DashboardActivityDTO[] {
  const envelope = asRecord(input) as ApiEnvelopeDTO<unknown>;
  const list = asArray(envelope.data ?? input);
  return list.map((item, index) => {
    const raw = asRecord(item);
    const typeValue = asString(raw.type, "system");
    const type: DashboardActivityDTO["type"] =
      typeValue === "voice" || typeValue === "escalation" || typeValue === "verify" ? typeValue : "system";

    return {
      id: asString(raw.id, `activity-${index}`),
      type,
      message: asString(raw.message || raw.detail, ""),
      time: asString(raw.time, ""),
      isAlert: Boolean(raw.isAlert || raw.alert),
      phone: asString(raw.phone, ""),
    };
  });
}

export function mapDashboardAnalytics(input: unknown): DashboardAnalyticsDTO {
  const envelope = asRecord(input) as ApiEnvelopeDTO<unknown>;
  const raw = asRecord(envelope.data ?? input);

  return {
    wardStats: asArray(raw.wardStats).map((entry) => {
      const row = asRecord(entry);
      return {
        ward: asString(row.ward, "Unknown"),
        slaRate: asNumber(row.slaRate, 0),
        avgResolutionHrs: asNumber(row.avgResolutionHrs, 0),
        citizenSatisfaction: asNumber(row.citizenSatisfaction, 0),
      };
    }),
    categoryTrend: asArray(raw.categoryTrend).map((entry) => {
      const row = asRecord(entry);
      return {
        cat: asString(row.cat || row.category, "Other"),
        count: asNumber(row.count, 0),
        color: asString(row.color, "") || undefined,
      };
    }),
    slaPerformance: asArray(raw.slaPerformance).map((entry) => {
      const row = asRecord(entry);
      return {
        date: asString(row.date, ""),
        onTime: asNumber(row.onTime, 0),
      };
    }),
  };
}
