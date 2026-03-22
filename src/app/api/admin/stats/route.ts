import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/api-wrapper';
import prisma from '@/lib/prisma';
import { successResponse } from '@/lib/api-response';
import { COMPLAINT_STATUS } from '@/constants/complaint.constants';

export const GET = withAuth(async (req: NextRequest, ctx: any) => {
  const user = ctx.user;
  if (user?.role !== 'ADMIN' && user?.role !== 'OFFICIAL') {
    throw new Error('Forbidden: Insufficient privileges');
  }

  // Aggregate stats
  const totalComplaints = await prisma.complaint.count();
  const pendingComplaints = await prisma.complaint.count({ where: { status: COMPLAINT_STATUS.PENDING } });
  const resolvedComplaints = await prisma.complaint.count({ where: { status: COMPLAINT_STATUS.RESOLVED } });
  const totalUsers = await prisma.user.count({ where: { role: 'USER' } });

  return successResponse({
    totalComplaints,
    pendingComplaints,
    resolvedComplaints,
    totalUsers,
    resolutionRate: totalComplaints > 0 ? (resolvedComplaints / totalComplaints) * 100 : 0
  }, 'Admin statistics retrieved successfully');
});
