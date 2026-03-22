export interface ApiErrorDTO {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

export interface PaginationMetaDTO {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedResponseDTO<T> extends PaginationMetaDTO {
  items: T[];
}

export interface ApiEnvelopeDTO<T = unknown> {
  success?: boolean;
  data?: T;
  error?: string | ApiErrorDTO;
  message?: string;
  pagination?: Partial<PaginationMetaDTO>;
}

export interface UploadedAssetDTO {
  id: string;
  filename?: string;
  url: string;
  thumbnailUrl?: string | null;
  mimeType?: string;
  size?: number;
}

export type JsonRecord = Record<string, unknown>;
