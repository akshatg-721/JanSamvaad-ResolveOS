import { PrismaClient, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ComplaintStateMachine } from './complaint-state-machine';
import { COMPLAINT_STATUS } from '@/constants/complaint.constants';
import { Role } from '@/types';

interface CreateComplaintInput {
  title: string;
  description: string;
  category: string;
  location: Prisma.InputJsonValue;
  userId: string;
  attachmentIds?: string[];
}

interface UpdateComplaintInput {
  title?: string;
  description?: string;
  category?: string;
  location?: Prisma.InputJsonValue;
}

interface ComplaintFilters {
  status?: string;
  category?: string;
  userId?: string;
  search?: string;
}

export class ComplaintService {
  constructor(private db: PrismaClient = prisma) {}

  async createComplaint(input: CreateComplaintInput) {
    const complaint = await this.db.complaint.create({
      data: {
        title: input.title,
        description: input.description,
        category: input.category as any,
        location: input.location ?? Prisma.JsonNull,
        userId: input.userId,
        status: 'PENDING',
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        attachments: true,
        _count: { select: { upvotes: true } },
      },
    });

    if (input.attachmentIds?.length) {
      await this.db.attachment.updateMany({
        where: { id: { in: input.attachmentIds } },
        data: { complaintId: complaint.id },
      });
    }

    return complaint;
  }

  async getComplaintById(id: string) {
    const complaint = await this.db.complaint.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        attachments: true,
        statusHistory: {
          include: { changedBy: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
        upvotes: true,
        _count: { select: { upvotes: true } },
      },
    });

    if (!complaint) throw new Error('Complaint not found');
    return complaint;
  }

  async getComplaints(filters: ComplaintFilters = {}, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const where: Prisma.ComplaintWhereInput = {};

    if (filters.status) where.status = filters.status as any;
    if (filters.category) where.category = filters.category as any;
    if (filters.userId) where.userId = filters.userId;
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [complaints, total] = await Promise.all([
      this.db.complaint.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          attachments: { select: { id: true, url: true, thumbnailUrl: true }, take: 1 },
          _count: { select: { upvotes: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.db.complaint.count({ where }),
    ]);

    return {
      data: complaints,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  async updateComplaint(id: string, userId: string, updates: UpdateComplaintInput) {
    const complaint = await this.db.complaint.findUnique({
      where: { id },
      select: { userId: true, status: true },
    });

    if (!complaint) throw new Error('Complaint not found');
    if (complaint.userId !== userId) throw new Error('Unauthorized');
    if (complaint.status === 'CLOSED') throw new Error('Cannot edit closed complaint');

    return this.db.complaint.update({
      where: { id },
      data: {
        ...updates,
        category: updates.category as any,
        location: updates.location === undefined ? undefined : updates.location ?? Prisma.JsonNull,
      },
      include: { user: { select: { id: true, name: true } }, attachments: true, _count: { select: { upvotes: true } } },
    });
  }

  async deleteComplaint(id: string, userId: string) {
    const complaint = await this.db.complaint.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!complaint) throw new Error('Complaint not found');
    if (complaint.userId !== userId) throw new Error('Unauthorized');

    return this.db.complaint.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async updateComplaintStatus(
    id: string,
    newStatus: COMPLAINT_STATUS,
    changedById: string,
    actorRole: Role,
    comment?: string
  ) {
    const complaint = await this.db.complaint.findUnique({
      where: { id },
      select: { status: true, userId: true },
    });

    if (!complaint) throw new Error('Complaint not found');

    const stateMachine = new ComplaintStateMachine(complaint.status as COMPLAINT_STATUS);
    const isOwner = complaint.userId === changedById;
    stateMachine.validateTransition(newStatus, actorRole, isOwner);

    const toResolved = newStatus === COMPLAINT_STATUS.RESOLVED;
    const leavingResolved = complaint.status === COMPLAINT_STATUS.RESOLVED && newStatus !== COMPLAINT_STATUS.RESOLVED;

    return this.db.$transaction(async (tx) => {
      const updated = await tx.complaint.update({
        where: { id },
        data: {
          status: newStatus as any,
          resolvedAt: toResolved ? new Date() : leavingResolved ? null : undefined,
        },
        include: { user: { select: { id: true, name: true, email: true } }, _count: { select: { upvotes: true } } },
      });

      await tx.statusHistory.create({
        data: {
          complaintId: id,
          fromStatus: complaint.status,
          toStatus: newStatus as any,
          changedById,
          comment: comment || null,
        },
      });

      return updated;
    });
  }

  async toggleUpvote(complaintId: string, userId: string) {
    const complaint = await this.db.complaint.findUnique({
      where: { id: complaintId },
      select: { id: true },
    });

    if (!complaint) throw new Error('Complaint not found');

    const existingUpvote = await this.db.upvote.findUnique({
      where: { complaintId_userId: { complaintId, userId } },
    });

    if (existingUpvote) {
      await this.db.upvote.delete({
        where: { complaintId_userId: { complaintId, userId } },
      });
    } else {
      await this.db.upvote.create({
        data: { complaintId, userId },
      });
    }

    const upvoteCount = await this.db.upvote.count({ where: { complaintId } });
    return { upvoted: !existingUpvote, count: upvoteCount };
  }

  async getUpvoteCount(complaintId: string) {
    return this.db.upvote.count({ where: { complaintId } });
  }

  async hasUserUpvoted(complaintId: string, userId: string) {
    const upvote = await this.db.upvote.findUnique({
      where: { complaintId_userId: { complaintId, userId } },
    });
    return !!upvote;
  }

  async getStatistics() {
    const [total, byStatus, byCategory, recent] = await Promise.all([
      this.db.complaint.count(),
      this.db.complaint.groupBy({
        by: ['status'],
        _count: true,
      }),
      this.db.complaint.groupBy({
        by: ['category'],
        _count: true,
      }),
      this.db.complaint.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, status: true, createdAt: true },
      }),
    ]);

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: item._count }), {}),
      byCategory: byCategory.reduce((acc, item) => ({ ...acc, [item.category]: item._count }), {}),
      recentComplaints: recent,
    };
  }
}

export const complaintService = new ComplaintService();
