import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/api-wrapper';
import { idParamSchema } from '@/lib/validators';
import { complaintService } from '@/services/complaint.service';
import { successResponse } from '@/lib/api-response';

export const POST = withAuth(async (req: NextRequest, ctx: any) => {
  const { id } = await idParamSchema.parseAsync(ctx.params);
  const user = ctx.user || { id: 'mock-user-id' };

  const result = await complaintService.toggleUpvote(id, user.id);
  return successResponse(result, result.upvoted ? 'Upvoted successfully' : 'Upvote removed');
});
