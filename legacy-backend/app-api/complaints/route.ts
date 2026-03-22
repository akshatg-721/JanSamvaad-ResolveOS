import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { complaintService } from '@/services';
import {
  successResponse,
  paginatedResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/api-response';
import {
  createComplaintSchema,
  complaintQuerySchema,
} from '@/lib/validators';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || undefined;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const validated = complaintQuerySchema.parse({
      page,
      limit,
      status,
      category,
      search,
    });

    const result = await complaintService.getComplaints(
      {
        status: validated.status,
        category: validated.category,
        search: validated.search,
      },
      validated.page,
      validated.limit
    );

    return paginatedResponse(
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total
    );
  } catch (error) {
    console.error('[GET /api/complaints]', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch complaints',
      'INTERNAL_ERROR',
      500
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);
    }

    const body = await req.json();
    const validated = createComplaintSchema.parse(body);

    const complaint = await complaintService.createComplaint({
      title: validated.title,
      description: validated.description,
      category: validated.category,
      location: validated.location as any,
      userId: session.user.id,
      attachmentIds: validated.attachmentIds,
    });

    return successResponse(complaint, 'Complaint created', 201);
  } catch (error) {
    console.error('[POST /api/complaints]', error);

    if (error instanceof z.ZodError) {
      return validationErrorResponse(
        error.errors[0]?.message || 'Validation failed'
      );
    }

    return errorResponse(
      error instanceof Error ? error.message : 'Failed to create complaint',
      'INTERNAL_ERROR',
      500
    );
  }
}
