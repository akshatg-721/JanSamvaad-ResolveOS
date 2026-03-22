import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, forbiddenResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);
    }

    if ((session.user as any).role !== 'ADMIN') {
      return forbiddenResponse('Admin access required');
    }

    const users = await prisma.user.findMany({
      select: {
        id: true, email: true, name: true, phone: true, role: true, createdAt: true, lastLoginAt: true,
        _count: { select: { complaints: true, upvotes: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(users);
  } catch (error) {
    console.error('[Admin Users Error]', error);
    return errorResponse('Failed to fetch users', 'INTERNAL_ERROR', 500);
  }
}
