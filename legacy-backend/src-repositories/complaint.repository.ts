import { COMPLAINT_STATUS } from '../constants/complaint.constants';
import prisma from '../lib/prisma';
import { BaseRepository } from './base.repository';
import { Complaint } from '../types';

export class ComplaintRepository extends BaseRepository<Complaint, any, any> {
  constructor() {
    super(prisma.complaint);
  }

  async findById(id: string): Promise<Complaint | null> {
    return this.model.findUnique({
      where: { id, deletedAt: null },
      include: {
        user: true,
        attachments: true,
        _count: {
          select: { upvotes: true }
        }
      }
    });
  }

  async findByUserId(userId: string, pagination: { page: number; limit: number }) {
    return this.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' }
    }, pagination);
  }

  async updateStatus(id: string, status: COMPLAINT_STATUS, comment?: string) {
    // Requires a transaction when used with StatusHistory
    return this.update(id, { status } as any);
  }

  async hasUserUpvoted(complaintId: string, userId: string): Promise<boolean> {
    const upvote = await prisma.upvote.findUnique({
      where: {
        complaintId_userId: { complaintId, userId }
      }
    });
    return !!upvote;
  }

  async addUpvote(complaintId: string, userId: string): Promise<void> {
    await prisma.upvote.create({
      data: { complaintId, userId }
    });
  }

  async removeUpvote(complaintId: string, userId: string): Promise<void> {
    await prisma.upvote.delete({
      where: {
        complaintId_userId: { complaintId, userId }
      }
    });
  }

  async getUpvoteCount(complaintId: string): Promise<number> {
    return prisma.upvote.count({
      where: { complaintId }
    });
  }
}

export const complaintRepository = new ComplaintRepository();
