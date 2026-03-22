import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            complaints: true,
            upvotes: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse('User not found', 'NOT_FOUND', 404);
    }

    return successResponse(user);
  } catch (error) {
    console.error('[Get Profile Error]', error);
    return errorResponse('Failed to fetch profile', 'INTERNAL_ERROR', 500);
  }
}

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);
    }

    const body = await req.json();
    const validated = updateProfileSchema.parse(body);

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: validated,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        updatedAt: true,
      },
    });

    return successResponse(user, 'Profile updated successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return validationErrorResponse(error.errors[0]?.message || 'Validation failed');
    }
    console.error('[Update Profile Error]', error);
    return errorResponse('Failed to update profile', 'INTERNAL_ERROR', 500);
  }
}
