import { z } from 'zod';
import { VALIDATION_LIMITS } from '@/constants/validation.constants';

export const registerSchema = z.object({
  email: z.string()
    .email({ message: 'कृपया एक वैध ईमेल पता दर्ज करें (Please enter a valid email address)' }),
  password: z.string()
    .min(VALIDATION_LIMITS.USER.PASSWORD_MIN_LENGTH, { message: `पासवर्ड कम से कम ${VALIDATION_LIMITS.USER.PASSWORD_MIN_LENGTH} अक्षरों का होना चाहिए` })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  name: z.string()
    .min(VALIDATION_LIMITS.USER.NAME_MIN_LENGTH)
    .max(VALIDATION_LIMITS.USER.NAME_MAX_LENGTH),
  phone: z.string()
    .regex(/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/, { message: 'कृपया वैध भारतीय फ़ोन नंबर दर्ज करें (Please enter a valid Indian mobile number)' })
    .optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export const updateProfileSchema = z.object({
  name: z.string()
    .min(VALIDATION_LIMITS.USER.NAME_MIN_LENGTH)
    .max(VALIDATION_LIMITS.USER.NAME_MAX_LENGTH)
    .optional(),
  phone: z.string()
    .regex(/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/)
    .optional(),
  avatar: z.string().url().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
});
