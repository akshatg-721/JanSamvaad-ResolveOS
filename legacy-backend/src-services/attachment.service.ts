import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export class AttachmentService {
  constructor(private db: PrismaClient = prisma) {}

  async createAttachment(
    filename: string,
    url: string,
    thumbnailUrl: string | null,
    mimeType: string,
    size: number,
    userId: string,
    cloudinaryId?: string
  ) {
    return this.db.attachment.create({
      data: {
        filename,
        url,
        thumbnailUrl,
        mimeType,
        size,
        userId,
        cloudinaryId: cloudinaryId || null,
      },
    });
  }

  async getAttachmentById(id: string) {
    return this.db.attachment.findUnique({ where: { id } });
  }

  async getAttachmentsByComplaintId(complaintId: string) {
    return this.db.attachment.findMany({
      where: { complaintId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async deleteAttachment(id: string, userId: string) {
    const attachment = await this.db.attachment.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!attachment) throw new Error('Attachment not found');
    if (attachment.userId !== userId) throw new Error('Unauthorized');

    return this.db.attachment.delete({ where: { id } });
  }

  async deleteAttachmentsByComplaintId(complaintId: string) {
    return this.db.attachment.deleteMany({ where: { complaintId } });
  }

  async getUserTotalUploadSize(userId: string) {
    const result = await this.db.attachment.aggregate({
      where: { userId },
      _sum: { size: true },
    });
    return result._sum?.size || 0;
  }
}

export const attachmentService = new AttachmentService();
