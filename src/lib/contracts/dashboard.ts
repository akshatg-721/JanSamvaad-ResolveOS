export interface DashboardStatsDTO {
  open: number;
  closed: number;
  pending: number;
  resolved: number;
  breachRisk: number;
  slaHitRate: string;
}

export interface DashboardActivityDTO {
  id: string;
  type: "voice" | "escalation" | "verify" | "system";
  message: string;
  time: string;
  isAlert?: boolean;
  phone?: string;
}

export interface TicketLedgerDTO {
  id: string;
  ref: string;
  category: string;
  wardId: number | null;
  severity: string;
  status: string;
  createdAt: string;
  phone?: string | null;
  evidenceUrl?: string | null;
}

export interface WardStatDTO {
  ward: string;
  slaRate: number;
  avgResolutionHrs?: number;
  citizenSatisfaction?: number;
}

export interface CategoryTrendDTO {
  cat: string;
  count: number;
  color?: string;
}

export interface DashboardAnalyticsDTO {
  wardStats: WardStatDTO[];
  categoryTrend: CategoryTrendDTO[];
  slaPerformance?: Array<{ date: string; onTime: number }>;
}
