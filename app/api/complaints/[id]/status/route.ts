import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { complaintService } from '@/services';
import {
  successResponse,
  errorResponse,
  forbiddenResponse,
  validationErrorResponse,
  notFoundResponse,
} from '@/lib/api-response';
import { z } from 'zod';
import { Role } from '@/types';
import { COMPLAINT_STATUS } from '@/constants/complaint.constants';

const statusUpdateSchema = z.object({
  status: z.nativeEnum(COMPLAINT_STATUS),
  comment: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);
    }

    const body = await req.json();
    const validated = statusUpdateSchema.parse(body);
    const actorRole = ((session.user as any).role || Role.USER) as Role;

    const { id } = await params;
    const complaint = await complaintService.updateComplaintStatus(
      id,
      validated.status,
      session.user.id,
      actorRole,
      validated.comment
    );

    return successResponse(complaint, 'Status updated');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return validationErrorResponse(
        error.errors[0]?.message || 'Validation failed'
      );
    }
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return notFoundResponse('Complaint');
      }
      if (error.message.includes('Only')) {
        return forbiddenResponse(error.message);
      }
      if (error.message.includes('Invalid status') || error.message.includes('Invalid transition')) {
        return errorResponse(error.message, 'INVALID_TRANSITION', 400);
      }
    }
    return errorResponse('Failed to update status', 'INTERNAL_ERROR', 500);
  }
}
