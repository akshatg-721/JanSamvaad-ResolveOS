import { attachmentRepository } from '../repositories/attachment.repository';
import { NotFoundError, ForbiddenError } from '../lib/error-handler';

export class UploadService {
  async uploadFile(file: any, userId: string, complaintId?: string) {
    // Note: Actual implementation will interact with lib/cloudinary.ts
    // For now returning mock structure matching DB expectations
    
    return attachmentRepository.create({
      userId,
      complaintId,
      filename: file.name,
      cloudinaryId: 'mock-cloudinary-id',
      url: 'mock-url',
      thumbnailUrl: 'mock-thumb',
      mediumUrl: 'mock-medium',
      mimeType: file.type,
      size: file.size
    });
  }

  async deleteFile(fileId: string, userId: string) {
    const file = await attachmentRepository.findById(fileId);
    if (!file) throw new NotFoundError('File not found');

    if (file.userId !== userId) throw new ForbiddenError();

    // Actual implementation would delete from Cloudinary here
    await attachmentRepository.delete(fileId);
    return true;
  }

  async getFilesByComplaintId(complaintId: string) {
    return attachmentRepository.findByComplaintId(complaintId);
  }
}

export const uploadService = new UploadService();
