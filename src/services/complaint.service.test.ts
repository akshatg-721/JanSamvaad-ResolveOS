import { complaintService } from './complaint.service';
import { complaintRepository } from '../repositories/complaint.repository';
import { ComplaintStateMachine } from './complaint-state-machine';
import { Role } from '../types';

// Mock dependencies
jest.mock('../repositories/complaint.repository');
jest.mock('./complaint-state-machine');

describe('ComplaintService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateComplaintStatus', () => {
    it('should throw an error if complaint is not found', async () => {
      (complaintRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        complaintService.updateComplaintStatus('invalid-id', 'admin-id', Role.ADMIN, 'RESOLVED' as any)
      ).rejects.toThrow('Complaint not found');
    });

    it('should successfully update status if state machine allows it', async () => {
      const mockComplaint = { id: 'c1', status: 'IN_PROGRESS', userId: 'user-1' };
      (complaintRepository.findById as jest.Mock).mockResolvedValue(mockComplaint);
      
      // Mock state machine transition validation to simply return the new state
      (ComplaintStateMachine.prototype.transition as jest.Mock).mockReturnValue('RESOLVED');
      
      (complaintRepository.updateStatus as jest.Mock).mockResolvedValue({ ...mockComplaint, status: 'RESOLVED' });

      const result = await complaintService.updateComplaintStatus('c1', 'admin-id', Role.ADMIN, 'RESOLVED' as any);
      
      expect(result.status).toBe('RESOLVED');
      expect(complaintRepository.updateStatus).toHaveBeenCalledWith('c1', 'RESOLVED');
    });
  });
});
