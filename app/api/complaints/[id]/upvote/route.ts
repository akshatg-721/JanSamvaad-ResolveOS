import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { complaintService } from '@/services';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api-response';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);
    }

    const { id } = await params;
    const result = await complaintService.toggleUpvote(id, session.user.id);
    return successResponse(result);
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return notFoundResponse('Complaint');
    }
    return errorResponse('Failed to toggle upvote', 'INTERNAL_ERROR', 500);
  }
}
