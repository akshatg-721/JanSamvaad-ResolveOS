import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { z } from 'zod';

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);
    }

    const body = await req.json();
    const validated = passwordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user) return errorResponse('User not found', 'NOT_FOUND', 404);

    const isValid = await bcrypt.compare(validated.currentPassword, user.password);
    if (!isValid) return errorResponse('Current password is incorrect', 'INVALID_PASSWORD', 400);

    const hashedPassword = await bcrypt.hash(validated.newPassword, 10);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return successResponse(null, 'Password changed successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return validationErrorResponse(error.errors[0]?.message || 'Validation failed');
    }
    return errorResponse('Failed to change password', 'INTERNAL_ERROR', 500);
  }
}