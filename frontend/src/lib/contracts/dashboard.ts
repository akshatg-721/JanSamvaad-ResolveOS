export interface DashboardStatsDTO {
  open: number;
  closed: number;
  breachRisk: number;
  slaHitRate: string;
}

export interface DashboardActivityDTO {
  id: string;
  type: "voice" | "escalation" | "verify" | "system" | "alert" | "sms" | "ai";
  message: string;
  time: string;
  isAlert: boolean;
  phone?: string;
}

export interface DashboardWardStatDTO {
  ward: string;
  slaRate: number;
  avgResolutionHrs: number;
  citizenSatisfaction: number;
}

export interface DashboardCategoryTrendDTO {
  cat: string;
  count: number;
  color?: string;
}

export interface DashboardSlaPerformanceDTO {
  week: string;
  onTime: number;
  breached: number;
}

export interface DashboardAnalyticsDTO {
  wardStats: DashboardWardStatDTO[];
  categoryTrend: DashboardCategoryTrendDTO[];
  slaPerformance: DashboardSlaPerformanceDTO[];
}

export interface TicketLedgerDTO {
  id: string;
  ref: string;
  category: string;
  wardId: number | null;
  severity: string;
  status: string;
  createdAt: string;
  phone: string | null;
  evidenceUrl: string | null;
}
