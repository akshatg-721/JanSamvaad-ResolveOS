import { NextRequest } from 'next/server';
import { withAuth, withErrorHandler, withValidation } from '@/lib/api-wrapper';
import { createComplaintSchema, complaintQuerySchema } from '@/lib/validators';
import { complaintService } from '@/services/complaint.service';
import { successResponse, paginatedResponse } from '@/lib/api-response';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const qObj = Object.fromEntries(searchParams.entries());
  
  // Validate query
  const query = await complaintQuerySchema.parseAsync(qObj);
  const { page, limit, sortBy, sortOrder, ...filters } = query;

  const result = await complaintService.getComplaints(filters, { page, limit });
  return paginatedResponse(result.data, result.meta!, 'Complaints retrieved successfully');
});

// Using our mock withAuth (stubbed in wrapper) and withValidation HOFs
export const POST = withAuth(
  withValidation(createComplaintSchema, async (req: NextRequest, ctx: any) => {
    // Current user injected via withAuth
    const user = ctx.user || { id: 'mock-user-id' }; 
    const complaint = await complaintService.createComplaint(user.id, ctx.validatedData);
    
    return successResponse(complaint, 'Complaint created successfully', 201);
  })
);
