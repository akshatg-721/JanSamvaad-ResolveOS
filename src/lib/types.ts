export type Section = 'overview' | 'gis' | 'ledger' | 'activity' | 'analytics' | 'settings';

export type UserRole = 'USER' | 'ADMIN' | 'OFFICIAL';

export type ComplaintStatus =
  | 'OPEN'
  | 'PENDING'
  | 'ACKNOWLEDGED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED'
  | 'CLOSED';

export type ComplaintCategory =
  | 'ROADS'
  | 'WATER'
  | 'ELECTRICITY'
  | 'SANITATION'
  | 'PUBLIC_SAFETY'
  | 'TRANSPORTATION'
  | 'OTHER';

export interface LocationData {
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

