import { z } from 'zod';
import { COMPLAINT_CATEGORY, COMPLAINT_STATUS } from '@/constants/complaint.constants';
import { VALIDATION_LIMITS } from '@/constants/validation.constants';
import { paginationSchema } from './common.validator';

export const createComplaintSchema = z.object({
  title: z.string()
    .min(VALIDATION_LIMITS.COMPLAINT.TITLE_MIN_LENGTH, `Title must be at least ${VALIDATION_LIMITS.COMPLAINT.TITLE_MIN_LENGTH} characters`)
    .max(VALIDATION_LIMITS.COMPLAINT.TITLE_MAX_LENGTH, `Title must not exceed ${VALIDATION_LIMITS.COMPLAINT.TITLE_MAX_LENGTH} characters`),
  description: z.string()
    .min(VALIDATION_LIMITS.COMPLAINT.DESCRIPTION_MIN_LENGTH, `Description is too short. Please provide more details (min ${VALIDATION_LIMITS.COMPLAINT.DESCRIPTION_MIN_LENGTH} chars)`)
    .max(VALIDATION_LIMITS.COMPLAINT.DESCRIPTION_MAX_LENGTH, `Description is too long (max ${VALIDATION_LIMITS.COMPLAINT.DESCRIPTION_MAX_LENGTH} chars)`),
  category: z.nativeEnum(COMPLAINT_CATEGORY, {
    errorMap: () => ({ message: 'Invalid complaint category selected' })
  }),
  location: z.object({
    address: z.string().min(5, 'Detailed address is required'),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional()
  }),
  attachmentIds: z.array(z.string()).max(VALIDATION_LIMITS.COMPLAINT.MAX_ATTACHMENTS).optional()
});

export const updateComplaintSchema = createComplaintSchema.partial()
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for an update'
  });

export const updateComplaintStatusSchema = z.object({
  status: z.nativeEnum(COMPLAINT_STATUS, {
    errorMap: () => ({ message: 'Invalid status provided' })
  }),
  comment: z.string().max(1000).optional()
});

export const complaintQuerySchema = paginationSchema.extend({
  status: z.nativeEnum(COMPLAINT_STATUS).optional(),
  category: z.nativeEnum(COMPLAINT_CATEGORY).optional(),
  search: z.string().max(100).optional()
});
