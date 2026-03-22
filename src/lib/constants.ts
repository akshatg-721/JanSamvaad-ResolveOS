export const COMPLAINT_STATUS = {
  PENDING: 'PENDING',
  ACKNOWLEDGED: 'ACKNOWLEDGED',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
  CLOSED: 'CLOSED',
} as const;

export const COMPLAINT_CATEGORY = {
  ROADS: 'ROADS',
  WATER: 'WATER',
  ELECTRICITY: 'ELECTRICITY',
  SANITATION: 'SANITATION',
  PUBLIC_SAFETY: 'PUBLIC_SAFETY',
  TRANSPORTATION: 'TRANSPORTATION',
  OTHER: 'OTHER',
} as const;

export const USER_ROLE = {
  USER: 'USER',
  OFFICIAL: 'OFFICIAL',
  ADMIN: 'ADMIN',
} as const;

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
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACKNOWLEDGED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  RESOLVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CLOSED: 'bg-gray-100 text-gray-800',
};

export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 5,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};
