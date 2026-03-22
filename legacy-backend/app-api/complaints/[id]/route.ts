import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { complaintService } from '@/services';
import {
  successResponse,
  notFoundResponse,
  errorResponse,
  forbiddenResponse,
  validationErrorResponse,
} from '@/lib/api-response';
import { updateComplaintSchema } from '@/lib/validators';
import { z } from 'zod';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const complaint = await complaintService.getComplaintById(id);
    return successResponse(complaint);
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return notFoundResponse('Complaint');
    }
    return errorResponse('Failed to fetch complaint', 'INTERNAL_ERROR', 500);
  }
}

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
    const validated = updateComplaintSchema.parse(body);

    const { id } = await params;
    const complaint = await complaintService.updateComplaint(
      id,
      session.user.id,
      validated as any
    );

    return successResponse(complaint, 'Complaint updated');
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
      if (error.message.includes('Unauthorized')) {
        return forbiddenResponse();
      }
    }
    return errorResponse('Failed to update complaint', 'INTERNAL_ERROR', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);
    }

    const { id } = await params;
    await complaintService.deleteComplaint(id, session.user.id);
    return successResponse(null, 'Complaint deleted');
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return notFoundResponse('Complaint');
      }
      if (error.message.includes('Unauthorized')) {
        return forbiddenResponse();
      }
    }
    return errorResponse('Failed to delete complaint', 'INTERNAL_ERROR', 500);
  }
}
