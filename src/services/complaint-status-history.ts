import prisma from '../lib/prisma';
import { COMPLAINT_STATUS } from '../constants/complaint.constants';

export class ComplaintStatusHistoryService {
  async recordStatusChange(
    complaintId: string,
    fromStatus: COMPLAINT_STATUS,
    toStatus: COMPLAINT_STATUS,
    changedById: string,
    comment?: string
  ) {
    return prisma.statusHistory.create({
      data: {
        complaintId,
        fromStatus,
        toStatus,
        changedById,
        comment
      }
    });
  }

  async getStatusHistory(complaintId: string) {
    return prisma.statusHistory.findMany({
      where: { complaintId },
      orderBy: { createdAt: 'desc' },
      include: {
        // Will include user details once mapped
      }
    });
  }
}

export const statusHistoryService = new ComplaintStatusHistoryService();
