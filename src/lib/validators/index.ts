import { z, ZodSchema } from 'zod';
export * from './common.validator';
export * from './user.validator';
export * from './complaint.validator';

/**
 * Utility to parse payloads against a Zod schema and throw our AppError
 * format if validation fails.
 */
export async function validateRequest<T>(schema: ZodSchema<T>, data: unknown): Promise<T> {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Map Zod errors to a cleaner format
      const message = error.errors[0]?.message || 'Validation failed';
      throw new Error(message);
    }
    throw error;
  }
}
