import { GET, POST } from './route';
import { NextRequest } from 'next/server';
import { complaintService } from '@/services/complaint.service';

// Mock dependencies
jest.mock('@/services/complaint.service');
jest.mock('@/lib/api-wrapper', () => ({
  withErrorHandler: (fn: any) => fn,
  withAuth: (fn: any) => fn,
  withValidation: (schema: any, fn: any) => async (req: any, ctx: any) => {
    // Inject mock validated data
    ctx.validatedData = { title: 'Test', description: 'Test desc', category: 'OTHER', location: { address: '123' } };
    ctx.user = { id: 'user-123' };
    return fn(req, ctx);
  }
}));

describe('Complaints API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/complaints', () => {
    it('returns a paginated list of complaints', async () => {
      const mockResult = {
        data: [{ id: '1', title: 'Test Complaint' }],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 }
      };
      
      (complaintService.getComplaints as jest.Mock).mockResolvedValue(mockResult);

      const req = new NextRequest('http://localhost:3000/api/complaints?page=1&limit=10');
      const response = await GET(req as any, {} as any);
      
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.length).toBe(1);
      expect(json.meta.total).toBe(1);
    });
  });

  describe('POST /api/complaints', () => {
    it('creates a new complaint and returns 201', async () => {
      const mockComplaint = { id: 'mock-123', title: 'Test' };
      (complaintService.createComplaint as jest.Mock).mockResolvedValue(mockComplaint);

      // Dummy request, actual payload parsed by the mocked withValidation
      const req = new NextRequest('http://localhost:3000/api/complaints', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(req as any, {} as any);
      
      expect(response.status).toBe(201);
      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.id).toBe('mock-123');
      expect(complaintService.createComplaint).toHaveBeenCalled();
    });
  });
});
