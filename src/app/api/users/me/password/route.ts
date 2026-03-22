import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword: z.string().min(8, 'Min 8 characters'),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);

    const body = await req.json();
    const data = schema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { password: true },
    });

    if (!user) return errorResponse('User not found', 'NOT_FOUND', 404);

    const valid = await bcrypt.compare(data.currentPassword, user.password);
    if (!valid) return errorResponse('Current password is incorrect', 'INVALID', 400);

    const hashed = await bcrypt.hash(data.newPassword, 10);
    await prisma.user.update({
      where: { id: (session.user as any).id },
      data: { password: hashed },
    });

    return successResponse(null, 'Password changed');
  } catch (error) {
    if (error instanceof z.ZodError) return validationErrorResponse(error.errors[0]?.message || 'Invalid');
    return errorResponse('Failed', 'INTERNAL_ERROR', 500);
  }
}
