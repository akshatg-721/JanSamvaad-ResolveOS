import { describe, it, expect } from 'vitest';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  validationErrorResponse,
  paginatedResponse,
} from '../api-response';

describe('API Response Utilities', () => {
  describe('successResponse', () => {
    it('should return success with data', async () => {
      const response = successResponse({ id: '1', name: 'Test' });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data).toEqual({ id: '1', name: 'Test' });
    });

    it('should accept custom status code', async () => {
      const response = successResponse({ id: '1' }, 'Created', 201);
      expect(response.status).toBe(201);
    });
  });

  describe('errorResponse', () => {
    it('should return error', async () => {
      const response = errorResponse('Something failed', 'TEST_ERROR', 400);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Something failed');
      expect(body.code).toBe('TEST_ERROR');
    });
  });

  describe('notFoundResponse', () => {
    it('should return 404', async () => {
      const response = notFoundResponse('Complaint');
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.error).toContain('not found');
    });
  });

  describe('unauthorizedResponse', () => {
    it('should return 401', async () => {
      const response = unauthorizedResponse();
      expect(response.status).toBe(401);
    });
  });

  describe('forbiddenResponse', () => {
    it('should return 403', async () => {
      const response = forbiddenResponse();
      expect(response.status).toBe(403);
    });
  });

  describe('validationErrorResponse', () => {
    it('should return 400', async () => {
      const response = validationErrorResponse('Invalid input');
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('paginatedResponse', () => {
    it('should return paginated data', async () => {
      const items = [{ id: '1' }, { id: '2' }];
      const response = paginatedResponse(items, 1, 10, 25);
      const body = await response.json();

      expect(body.success).toBe(true);
      expect(body.data).toHaveLength(2);
      expect(body.pagination.page).toBe(1);
      expect(body.pagination.total).toBe(25);
      expect(body.pagination.totalPages).toBe(3);
      expect(body.pagination.hasMore).toBe(true);
    });

    it('should calculate hasMore correctly', async () => {
      const response = paginatedResponse([], 3, 10, 25);
      const body = await response.json();

      expect(body.pagination.hasMore).toBe(false);
    });
  });
});
