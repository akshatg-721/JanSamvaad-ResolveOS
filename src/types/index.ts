import { COMPLAINT_CATEGORY, COMPLAINT_STATUS } from '../constants/complaint.constants';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  OFFICIAL = 'OFFICIAL' // department official
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: Role;
  avatar?: string;
  emailVerified?: Date;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  id: string;
  complaintId: string;
  userId: string;
  filename: string;
  cloudinaryId: string;
  url: string;
  thumbnailUrl: string;
  mediumUrl: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: COMPLAINT_CATEGORY;
  status: COMPLAINT_STATUS;
  location: {
    address: string;
    lat?: number;
    lng?: number;
    city?: string;
    state?: string;
    pincode?: string;
  };
  userId: string;
  assignedToId?: string;
  priority: number;
  resolvedAt?: Date;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations mapped out
  attachments?: Attachment[];
  upvotes?: Upvote[];
  statusHistory?: StatusHistory[];
  comments?: Comment[];
}

export interface Upvote {
  id: string;
  complaintId: string;
  userId: string;
  createdAt: Date;
}

export interface StatusHistory {
  id: string;
  complaintId: string;
  fromStatus: COMPLAINT_STATUS;
  toStatus: COMPLAINT_STATUS;
  changedById: string;
  comment?: string;
  createdAt: Date;
}

export interface Comment {
  id: string;
  complaintId: string;
  userId: string;
  content: string;
  isOfficial: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    details?: any;
  };
}
