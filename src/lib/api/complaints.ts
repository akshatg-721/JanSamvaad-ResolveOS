import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { requestJson } from "@/lib/api/client";
import type {
  ComplaintDTO,
  ComplaintQueryParamsDTO,
  CreateComplaintPayloadDTO,
  ResolutionFeedbackPayloadDTO,
  UpdateComplaintPayloadDTO,
  UpdateComplaintStatusPayloadDTO,
} from "@/lib/contracts/complaint";
import type { PaginatedResponseDTO } from "@/lib/contracts/common";
import { mapComplaint, mapComplaintsPage } from "@/lib/mappers/complaint.mapper";

export async function getComplaints(
  query?: ComplaintQueryParamsDTO
): Promise<PaginatedResponseDTO<ComplaintDTO>> {
  const response = await requestJson<unknown>(API_ENDPOINTS.complaints.list, {
    method: "GET",
    query: query as Record<string, string | number | boolean | null | undefined> | undefined,
  });
  return mapComplaintsPage(response, query?.limit ?? 20);
}

export async function getComplaintById(id: string): Promise<ComplaintDTO> {
  const response = await requestJson<unknown>(API_ENDPOINTS.complaints.byId(id), {
    method: "GET",
  });
  return mapComplaint(response);
}

export async function createComplaint(payload: CreateComplaintPayloadDTO): Promise<ComplaintDTO> {
  const response = await requestJson<unknown>(API_ENDPOINTS.complaints.list, {
    method: "POST",
    body: payload,
  });
  return mapComplaint(response);
}

export async function updateComplaint(id: string, payload: UpdateComplaintPayloadDTO): Promise<ComplaintDTO> {
  const response = await requestJson<unknown>(API_ENDPOINTS.complaints.byId(id), {
    method: "PATCH",
    body: payload,
  });
  return mapComplaint(response);
}

export async function deleteComplaint(id: string): Promise<void> {
  await requestJson<unknown>(API_ENDPOINTS.complaints.byId(id), {
    method: "DELETE",
  });
}

export async function updateComplaintStatus(
  id: string,
  payload: UpdateComplaintStatusPayloadDTO
): Promise<ComplaintDTO> {
  const response = await requestJson<unknown>(API_ENDPOINTS.complaints.status(id), {
    method: "POST",
    body: payload,
  });
  return mapComplaint(response);
}

export async function toggleUpvote(id: string): Promise<{ upvoted: boolean; count: number }> {
  const response = await requestJson<any>(API_ENDPOINTS.complaints.upvote(id), {
    method: "POST",
  });

  const data = response?.data ?? response ?? {};
  return {
    upvoted: Boolean(data.upvoted),
    count: Number(data.count ?? data.upvoteCount ?? 0),
  };
}

export async function submitTicketResolutionFeedback(
  ticketId: string,
  payload: ResolutionFeedbackPayloadDTO
): Promise<void> {
  await requestJson<unknown>(API_ENDPOINTS.dashboard.ticketResolve(ticketId), {
    method: "POST",
    auth: false,
    body: payload,
  });
}

