import { complaintRepository } from '../repositories/complaint.repository';
import { NotFoundError, ForbiddenError, ValidationError } from '../lib/error-handler';
import { COMPLAINT_STATUS } from '../constants/complaint.constants';
import { Role } from '../types';

export class ComplaintService {
  async createComplaint(userId: string, data: any) {
    // Validate attachments if necessary
    return complaintRepository.create({
      ...data,
      userId,
      status: COMPLAINT_STATUS.PENDING
    });
  }

  async getComplaintById(id: string, userId?: string) {
    const complaint = await complaintRepository.findById(id);
    if (!complaint) throw new NotFoundError('Complaint not found');

    let hasUpvoted = false;
    if (userId) {
      hasUpvoted = await complaintRepository.hasUserUpvoted(id, userId);
    }

    return { ...complaint, hasUpvoted };
  }

  async getComplaints(filters: any, pagination: { page: number; limit: number }) {
    return complaintRepository.findMany({ where: filters, orderBy: { createdAt: 'desc' } }, pagination);
  }

  async getUserComplaints(userId: string, pagination: { page: number; limit: number }) {
    return complaintRepository.findByUserId(userId, pagination);
  }

  async updateComplaint(id: string, userId: string, data: any) {
    const complaint = await complaintRepository.findById(id);
    if (!complaint) throw new NotFoundError();
    if (complaint.userId !== userId) throw new ForbiddenError('You can only edit your own complaints');
    if (complaint.status === COMPLAINT_STATUS.CLOSED) throw new ValidationError('Cannot edit closed complaints');

    return complaintRepository.update(id, data);
  }

  async updateComplaintStatus(id: string, adminId: string, adminRole: Role, status: COMPLAINT_STATUS, comment?: string) {
    if (adminRole !== Role.ADMIN && adminRole !== Role.OFFICIAL) {
      throw new ForbiddenError('Only admins and officials can change status');
    }

    const complaint = await complaintRepository.findById(id);
    if (!complaint) throw new NotFoundError();

    // To implement: validate transition using ComplaintStateMachine
    // Create StatusHistory entry

    return complaintRepository.updateStatus(id, status, comment);
  }

  async deleteComplaint(id: string, userId: string, role: Role) {
    const complaint = await complaintRepository.findById(id);
    if (!complaint) throw new NotFoundError();

    if (complaint.userId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenError();
    }

    return complaintRepository.delete(id);
  }

  async toggleUpvote(complaintId: string, userId: string) {
    const hasUpvoted = await complaintRepository.hasUserUpvoted(complaintId, userId);
    
    if (hasUpvoted) {
      await complaintRepository.removeUpvote(complaintId, userId);
    } else {
      await complaintRepository.addUpvote(complaintId, userId);
    }

    const newCount = await complaintRepository.getUpvoteCount(complaintId);
    return { upvoted: !hasUpvoted, count: newCount };
  }
}

export const complaintService = new ComplaintService();
