import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockPrisma } from '@/test/mock-prisma';
import { createMockComplaint } from '@/test/factories';
import { Role } from '@/types';

import { ComplaintService } from '../complaint.service';

describe('ComplaintService', () => {
  let service: ComplaintService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ComplaintService(mockPrisma as any);
  });

  describe('createComplaint', () => {
    it('should create a complaint successfully', async () => {
      const mockComplaint = createMockComplaint({ status: 'PENDING' });
      mockPrisma.complaint.create.mockResolvedValue(mockComplaint);

      const result = await service.createComplaint({
        title: 'Test Complaint Title Here',
        description: 'This is a test description that is long enough to pass validation checks',
        category: 'ROADS',
        location: { address: 'Test Address', city: 'Mumbai' } as any,
        userId: 'user-123',
      });

      expect(result).toBeDefined();
      expect(mockPrisma.complaint.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'Test Complaint Title Here',
            status: 'PENDING',
            userId: 'user-123',
          }),
        })
      );
    });

    it('should associate attachments if provided', async () => {
      const mockComplaint = createMockComplaint();
      mockPrisma.complaint.create.mockResolvedValue(mockComplaint);
      mockPrisma.attachment.updateMany.mockResolvedValue({ count: 2 });

      await service.createComplaint({
        title: 'Complaint With Attachments Test',
        description: 'This is a test description with enough characters for validation',
        category: 'WATER',
        location: { address: 'Test' } as any,
        userId: 'user-123',
        attachmentIds: ['att-1', 'att-2'],
      });

      expect(mockPrisma.attachment.updateMany).toHaveBeenCalledWith({
        where: { id: { in: ['att-1', 'att-2'] } },
        data: { complaintId: mockComplaint.id },
      });
    });
  });

  describe('getComplaintById', () => {
    it('should return complaint with relations', async () => {
      const mockComplaint = createMockComplaint();
      mockPrisma.complaint.findUnique.mockResolvedValue(mockComplaint);

      const result = await service.getComplaintById(mockComplaint.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockComplaint.id);
    });

    it('should throw error if complaint not found', async () => {
      mockPrisma.complaint.findUnique.mockResolvedValue(null);

      await expect(
        service.getComplaintById('nonexistent-id')
      ).rejects.toThrow('Complaint not found');
    });
  });

  describe('getComplaints', () => {
    it('should return paginated complaints', async () => {
      const mockComplaints = Array.from({ length: 5 }, () => createMockComplaint());
      mockPrisma.complaint.findMany.mockResolvedValue(mockComplaints);
      mockPrisma.complaint.count.mockResolvedValue(25);

      const result = await service.getComplaints({}, 1, 10);

      expect(result.data).toHaveLength(5);
      expect(result.pagination.total).toBe(25);
      expect(result.pagination.totalPages).toBe(3);
      expect(result.pagination.page).toBe(1);
    });

    it('should filter by status', async () => {
      mockPrisma.complaint.findMany.mockResolvedValue([]);
      mockPrisma.complaint.count.mockResolvedValue(0);

      await service.getComplaints({ status: 'PENDING' }, 1, 10);

      expect(mockPrisma.complaint.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'PENDING',
          }),
        })
      );
    });

    it('should search by title and description', async () => {
      mockPrisma.complaint.findMany.mockResolvedValue([]);
      mockPrisma.complaint.count.mockResolvedValue(0);

      await service.getComplaints({ search: 'pothole' }, 1, 10);

      expect(mockPrisma.complaint.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({
                title: expect.objectContaining({ contains: 'pothole' }),
              }),
            ]),
          }),
        })
      );
    });
  });

  describe('updateComplaint', () => {
    it('should update complaint if user is owner', async () => {
      const mockComplaint = createMockComplaint({
        userId: 'user-123',
        status: 'PENDING',
      });
      mockPrisma.complaint.findUnique.mockResolvedValue(mockComplaint);
      mockPrisma.complaint.update.mockResolvedValue({
        ...mockComplaint,
        title: 'Updated Title',
      });

      const result = await service.updateComplaint(
        mockComplaint.id,
        'user-123',
        { title: 'Updated Title' }
      );

      expect(result.title).toBe('Updated Title');
    });

    it('should throw error if user is not owner', async () => {
      const mockComplaint = createMockComplaint({ userId: 'other-user' });
      mockPrisma.complaint.findUnique.mockResolvedValue(mockComplaint);

      await expect(
        service.updateComplaint(mockComplaint.id, 'user-123', { title: 'New' })
      ).rejects.toThrow();
    });

    it('should throw error if complaint is closed', async () => {
      const mockComplaint = createMockComplaint({
        userId: 'user-123',
        status: 'CLOSED',
      });
      mockPrisma.complaint.findUnique.mockResolvedValue(mockComplaint);

      await expect(
        service.updateComplaint(mockComplaint.id, 'user-123', { title: 'New' })
      ).rejects.toThrow();
    });
  });

  describe('updateComplaintStatus', () => {
    it('should update status with valid transition', async () => {
      const mockComplaint = createMockComplaint({ status: 'PENDING', userId: 'user-001' });
      mockPrisma.complaint.findUnique.mockResolvedValue(mockComplaint);

      const updatedComplaint = { ...mockComplaint, status: 'ACKNOWLEDGED' };
      mockPrisma.complaint.update.mockResolvedValue(updatedComplaint);
      mockPrisma.statusHistory.create.mockResolvedValue({});
      mockPrisma.$transaction.mockImplementation(async (fn: any) => fn(mockPrisma));

      const result = await service.updateComplaintStatus(
        mockComplaint.id,
        'ACKNOWLEDGED' as any,
        'admin-123',
        Role.ADMIN,
        'Reviewing complaint'
      );

      expect(result).toBeDefined();
    });

    it('should throw error for invalid transition', async () => {
      const mockComplaint = createMockComplaint({ status: 'CLOSED', userId: 'user-001' });
      mockPrisma.complaint.findUnique.mockResolvedValue(mockComplaint);

      await expect(
        service.updateComplaintStatus(mockComplaint.id, 'PENDING' as any, 'admin-123', Role.ADMIN)
      ).rejects.toThrow();
    });
  });

  describe('toggleUpvote', () => {
    it('should add upvote if not exists', async () => {
      const mockComplaint = createMockComplaint();
      mockPrisma.complaint.findUnique.mockResolvedValue(mockComplaint);
      mockPrisma.upvote.findUnique.mockResolvedValue(null);
      mockPrisma.upvote.create.mockResolvedValue({});
      mockPrisma.upvote.count.mockResolvedValue(5);

      const result = await service.toggleUpvote(mockComplaint.id, 'user-123');

      expect(result.upvoted).toBe(true);
      expect(result.count).toBe(5);
      expect(mockPrisma.upvote.create).toHaveBeenCalled();
    });

    it('should remove upvote if exists', async () => {
      const mockComplaint = createMockComplaint();
      mockPrisma.complaint.findUnique.mockResolvedValue(mockComplaint);
      mockPrisma.upvote.findUnique.mockResolvedValue({ id: 'upvote-1' });
      mockPrisma.upvote.delete.mockResolvedValue({});
      mockPrisma.upvote.count.mockResolvedValue(3);

      const result = await service.toggleUpvote(mockComplaint.id, 'user-123');

      expect(result.upvoted).toBe(false);
      expect(result.count).toBe(3);
      expect(mockPrisma.upvote.delete).toHaveBeenCalled();
    });

    it('should throw error if complaint not found', async () => {
      mockPrisma.complaint.findUnique.mockResolvedValue(null);

      await expect(
        service.toggleUpvote('nonexistent', 'user-123')
      ).rejects.toThrow('Complaint not found');
    });
  });

  describe('deleteComplaint', () => {
    it('should soft delete complaint', async () => {
      const mockComplaint = createMockComplaint({ userId: 'user-123' });
      mockPrisma.complaint.findUnique.mockResolvedValue(mockComplaint);
      mockPrisma.complaint.update.mockResolvedValue({
        ...mockComplaint,
        deletedAt: new Date(),
      });

      await service.deleteComplaint(mockComplaint.id, 'user-123');

      expect(mockPrisma.complaint.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            deletedAt: expect.any(Date),
          }),
        })
      );
    });

    it('should throw error if not owner', async () => {
      const mockComplaint = createMockComplaint({ userId: 'other-user' });
      mockPrisma.complaint.findUnique.mockResolvedValue(mockComplaint);

      await expect(
        service.deleteComplaint(mockComplaint.id, 'user-123')
      ).rejects.toThrow();
    });
  });

  describe('getStatistics', () => {
    it('should return dashboard statistics', async () => {
      mockPrisma.complaint.count.mockResolvedValue(50);
      mockPrisma.complaint.groupBy
        .mockResolvedValueOnce([
          { status: 'PENDING', _count: 10 },
          { status: 'RESOLVED', _count: 30 },
        ])
        .mockResolvedValueOnce([
          { category: 'ROADS', _count: 15 },
          { category: 'WATER', _count: 10 },
        ]);
      mockPrisma.complaint.findMany.mockResolvedValue([]);

      const result = await service.getStatistics();

      expect(result.total).toBe(50);
      expect(result.byStatus).toBeDefined();
      expect(result.byCategory).toBeDefined();
    });
  });
});
