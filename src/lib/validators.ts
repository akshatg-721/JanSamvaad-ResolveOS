import { z } from 'zod';
import { COMPLAINT_CATEGORY, COMPLAINT_STATUS } from '@/constants/complaint.constants';

export const createComplaintSchema = z.object({
  title: z.string().min(10).max(255),
  description: z.string().min(50).max(5000),
  category: z.nativeEnum(COMPLAINT_CATEGORY),
  location: z.object({
    address: z.string().min(5),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),
  attachmentIds: z.array(z.string()).optional(),
});

export const updateComplaintSchema = z.object({
  title: z.string().min(10).max(255).optional(),
  description: z.string().min(50).max(5000).optional(),
  category: z.nativeEnum(COMPLAINT_CATEGORY).optional(),
  location: z.object({
    address: z.string().min(5),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for an update',
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
});

export const complaintQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.nativeEnum(COMPLAINT_STATUS).optional(),
  category: z.nativeEnum(COMPLAINT_CATEGORY).optional(),
  search: z.string().max(100).optional(),
});