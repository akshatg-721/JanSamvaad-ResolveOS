import type { JsonRecord } from "./common";

export type ComplaintStatusDTO =
  | "OPEN"
  | "PENDING"
  | "ACKNOWLEDGED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "REJECTED"
  | "CLOSED"
  | string;

export type ComplaintSeverityDTO =
  | "Critical"
  | "High"
  | "Medium"
  | "Low"
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | string;

export interface ComplaintLocationDTO {
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
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
  raw?: JsonRecord;
}

export interface ComplaintQueryParamsDTO {
  page?: number;
  limit?: number;
  status?: string;
  severity?: string;
  category?: string;
  search?: string;
}

export interface CreateComplaintPayloadDTO {
  title: string;
  description: string;
  category: string;
  location?: ComplaintLocationDTO;
  attachmentIds?: string[];
}

export type UpdateComplaintPayloadDTO = Partial<CreateComplaintPayloadDTO>;

export interface UpdateComplaintStatusPayloadDTO {
  status: string;
  comment?: string;
}

export interface ResolutionFeedbackPayloadDTO {
  token?: string | null;
  rating: number;
  text?: string;
}
