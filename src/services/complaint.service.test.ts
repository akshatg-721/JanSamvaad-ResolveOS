import { ComplaintService } from './complaint.service';
import { Role } from '../types';
import { COMPLAINT_STATUS } from '../constants/complaint.constants';

describe('ComplaintService', () => {
  describe('updateComplaintStatus', () => {
    it('should throw an error if complaint is not found', async () => {
      const dbMock: any = {
        complaint: {
          findUnique: jest.fn().mockResolvedValue(null),
        },
      };
      const service = new ComplaintService(dbMock);

      await expect(
        service.updateComplaintStatus('invalid-id', COMPLAINT_STATUS.RESOLVED, 'admin-id', Role.ADMIN)
      ).rejects.toThrow('Complaint not found');
    });

    it('should update status and write status history for valid transitions', async () => {
      const txMock = {
        complaint: {
          update: jest.fn().mockResolvedValue({ id: 'c1', status: COMPLAINT_STATUS.RESOLVED }),
        },
        statusHistory: {
          create: jest.fn().mockResolvedValue({ id: 'h1' }),
        },
      };

      const dbMock: any = {
        complaint: {
          findUnique: jest.fn().mockResolvedValue({
            status: COMPLAINT_STATUS.IN_PROGRESS,
            userId: 'user-1',
          }),
        },
        $transaction: jest.fn().mockImplementation(async (callback: any) => callback(txMock)),
      };

      const service = new ComplaintService(dbMock);
      const result = await service.updateComplaintStatus(
        'c1',
        COMPLAINT_STATUS.RESOLVED,
        'admin-id',
        Role.ADMIN
      );

      expect(result.status).toBe(COMPLAINT_STATUS.RESOLVED);
      expect(txMock.complaint.update).toHaveBeenCalled();
      expect(txMock.statusHistory.create).toHaveBeenCalled();
    });
  });
});
