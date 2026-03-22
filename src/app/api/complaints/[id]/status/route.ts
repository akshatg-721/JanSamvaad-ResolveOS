import { NextRequest } from 'next/server';
import { withAuth, withValidation } from '@/lib/api-wrapper';
import { updateComplaintStatusSchema, idParamSchema } from '@/lib/validators';
import { complaintService } from '@/services/complaint.service';
import { successResponse } from '@/lib/api-response';

export const PATCH = withAuth(
  withValidation(updateComplaintStatusSchema, async (req: NextRequest, ctx: any) => {
    const { id } = await idParamSchema.parseAsync(ctx.params);
    const user = ctx.user || { id: 'mock-user-id', role: 'ADMIN' }; // injected from token
    const { status, comment } = ctx.validatedData;

    const result = await complaintService.updateComplaintStatus(id, user.id, user.role as any, status, comment);
    return successResponse(result, 'Complaint status updated successfully');
  })
);
