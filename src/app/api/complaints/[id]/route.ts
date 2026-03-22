import { NextRequest } from 'next/server';
import { withAuth, withErrorHandler, withValidation } from '@/lib/api-wrapper';
import { updateComplaintSchema, idParamSchema } from '@/lib/validators';
import { complaintService } from '@/services/complaint.service';
import { successResponse } from '@/lib/api-response';

export const GET = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = await idParamSchema.parseAsync(params);
  
  // Might need session to check if user has upvoted
  const complaint = await complaintService.getComplaintById(id);
  return successResponse(complaint);
});

export const PATCH = withAuth(
  withValidation(updateComplaintSchema, async (req: NextRequest, ctx: any) => {
    const { id } = await idParamSchema.parseAsync(ctx.params);
    const user = ctx.user || { id: 'mock-user-id' };

    const updated = await complaintService.updateComplaint(id, user.id, ctx.validatedData);
    return successResponse(updated, 'Complaint updated successfully');
  })
);

export const DELETE = withAuth(async (req: NextRequest, ctx: any) => {
  const { id } = await idParamSchema.parseAsync(ctx.params);
  const user = ctx.user || { id: 'mock-user-id', role: 'USER' };

  await complaintService.deleteComplaint(id, user.id, user.role);
  return successResponse(null, 'Complaint deleted successfully');
});
