import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);
    if ((session.user as any).role !== 'ADMIN') return errorResponse('Forbidden', 'FORBIDDEN', 403);

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { complaints: true } },
      },
    });

    return successResponse(users);
  } catch (error) {
    return errorResponse('Failed to fetch users', 'INTERNAL_ERROR', 500);
  }
}