import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { requestJson } from "@/lib/api/client";
import type {
  DashboardActivityDTO,
  DashboardAnalyticsDTO,
  DashboardStatsDTO,
  TicketLedgerDTO,
} from "@/lib/contracts/dashboard";
import { mapDashboardActivity, mapDashboardAnalytics, mapDashboardStats, mapTicketLedgerList } from "@/lib/mappers/dashboard.mapper";

export async function getDashboardStats(): Promise<DashboardStatsDTO> {
  const response = await requestJson<unknown>(API_ENDPOINTS.dashboard.stats, {
    method: "GET",
  });
  return mapDashboardStats(response);
}

export async function getDashboardActivity(): Promise<DashboardActivityDTO[]> {
  try {
    const response = await requestJson<unknown>(API_ENDPOINTS.dashboard.activity, {
      method: "GET",
    });
    return mapDashboardActivity(response);
  } catch {
    return [];
  }
}

export async function getDashboardAnalytics(): Promise<DashboardAnalyticsDTO> {
  const response = await requestJson<unknown>(API_ENDPOINTS.dashboard.analytics, {
    method: "GET",
  });
  return mapDashboardAnalytics(response);
}

export async function getTickets(query?: { limit?: number; status?: string }): Promise<TicketLedgerDTO[]> {
  const response = await requestJson<unknown>(API_ENDPOINTS.dashboard.tickets, {
    method: "GET",
    query,
  });
  return mapTicketLedgerList(response);
}

export async function createTicket(payload: {
  phone: string;
  category: string;
  ward_id: number;
  severity: string;
}): Promise<void> {
  await requestJson<unknown>(API_ENDPOINTS.dashboard.tickets, {
    method: "POST",
    body: payload,
  });
}

export async function generateTicketQr(ticketId: string): Promise<{ token: string }> {
  const response = await requestJson<any>(API_ENDPOINTS.dashboard.ticketGenerateQr(ticketId), {
    method: "POST",
  });
  const data = response?.data ?? response ?? {};
  return { token: String(data.token || "") };
}
