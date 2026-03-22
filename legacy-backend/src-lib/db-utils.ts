import { Prisma } from '@prisma/client';
import prisma from './prisma';

export async function checkConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    // Log gracefully or push to monitoring system
    return false;
  }
}

/**
 * Parses raw Prisma Client Known Request Errors into an application-friendly string.
 */
export function extractPrismaError(error: unknown): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return `Unique constraint failed on the field(s): ${error.meta?.target}`;
      case 'P2014':
        return `The change you are trying to make would violate the required relation between models.`;
      case 'P2003':
        return `Foreign key constraint failed on the field: ${error.meta?.field_name}`;
      case 'P2025':
        return `Record to update not found.`;
      default:
        return `Database Error: ${error.message}`;
    }
  }
  return 'An unknown database error occurred.';
}
