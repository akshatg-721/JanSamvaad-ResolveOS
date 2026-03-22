import { z } from 'zod';
import { PAGINATION } from '../constants/api.constants';

// For UUIDs/Cuids
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required').max(100, 'Invalid ID format')
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(PAGINATION.DEFAULT_LIMIT),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});
