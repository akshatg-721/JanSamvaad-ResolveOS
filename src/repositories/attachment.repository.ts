import prisma from '../lib/prisma';
import { BaseRepository } from './base.repository';
import { Attachment } from '../types';

export class AttachmentRepository extends BaseRepository<Attachment, any, any> {
  constructor() {
    super(prisma.attachment);
  }

  async findByComplaintId(complaintId: string): Promise<Attachment[]> {
    return this.model.findMany({
      where: { complaintId }
    });
  }

  async deleteByComplaintId(complaintId: string): Promise<void> {
    await this.model.deleteMany({
      where: { complaintId }
    });
  }

  // Hard delete overwrite
  async delete(id: string): Promise<Attachment> {
    return this.model.delete({
      where: { id }
    });
  }
}

export const attachmentRepository = new AttachmentRepository();
