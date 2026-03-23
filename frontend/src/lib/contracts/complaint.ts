export type ComplaintStatusDTO =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | string;

export type ComplaintSeverityDTO = "Critical" | "High" | "Medium" | "Low" | string;

export interface ComplaintLocationDTO {
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
}

export interface ComplaintDTO {
  id: string;
  ref: string;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatusDTO;
  severity: ComplaintSeverityDTO;
  priority: number;
  wardId: number | null;
  wardName?: string | null;
  location: ComplaintLocationDTO | null;
  createdAt: string;
  updatedAt?: string | null;
  upvoteCount: number;
  commentCount: number;
  attachmentCount: number;
  citizenPhone?: string | null;
  evidenceUrl?: string | null;
}

export interface ComplaintQueryParamsDTO {
  page?: number;
  limit?: number;
  status?: string;
  severity?: string;
  category?: string;
  search?: string;
}

export interface ResolutionFeedbackPayloadDTO {
  token?: string | null;
  rating: number;
  text?: string;
}
