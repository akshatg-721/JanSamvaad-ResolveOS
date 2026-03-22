export const COMPLAINT_STATUS = {
  PENDING: 'PENDING',
  ACKNOWLEDGED: 'ACKNOWLEDGED',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
  CLOSED: 'CLOSED',
} as const;

export type ComplaintStatusType = keyof typeof COMPLAINT_STATUS;

export const COMPLAINT_CATEGORY = {
  ROADS: 'ROADS',
  WATER: 'WATER',
  ELECTRICITY: 'ELECTRICITY',
  SANITATION: 'SANITATION',
  PUBLIC_SAFETY: 'PUBLIC_SAFETY',
  TRANSPORTATION: 'TRANSPORTATION',
  OTHER: 'OTHER',
} as const;

export type ComplaintCategoryType = keyof typeof COMPLAINT_CATEGORY;

export const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  ACKNOWLEDGED: 'Acknowledged',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  REJECTED: 'Rejected',
  CLOSED: 'Closed',
};

export const CATEGORY_LABELS: Record<string, string> = {
  ROADS: 'Roads & Infrastructure',
  WATER: 'Water Supply',
  ELECTRICITY: 'Electricity',
  SANITATION: 'Sanitation & Waste',
  PUBLIC_SAFETY: 'Public Safety',
  TRANSPORTATION: 'Transportation',
  OTHER: 'Other',
};

export const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  ACKNOWLEDGED: 'bg-blue-100 text-blue-800 border-blue-200',
  IN_PROGRESS: 'bg-purple-100 text-purple-800 border-purple-200',
  RESOLVED: 'bg-green-100 text-green-800 border-green-200',
  REJECTED: 'bg-red-100 text-red-800 border-red-200',
  CLOSED: 'bg-gray-100 text-gray-800 border-gray-200',
};

export const CATEGORY_COLORS: Record<string, string> = {
  ROADS: 'bg-orange-100 text-orange-800',
  WATER: 'bg-cyan-100 text-cyan-800',
  ELECTRICITY: 'bg-yellow-100 text-yellow-800',
  SANITATION: 'bg-lime-100 text-lime-800',
  PUBLIC_SAFETY: 'bg-red-100 text-red-800',
  TRANSPORTATION: 'bg-indigo-100 text-indigo-800',
  OTHER: 'bg-gray-100 text-gray-800',
};

export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  MAX_FILES: 5,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;
