import { describe, it, expect } from 'vitest';
import {
  createComplaintSchema,
  updateComplaintSchema,
  registerSchema,
  loginSchema,
  complaintQuerySchema,
} from '../validators';

describe('Validators', () => {
  describe('createComplaintSchema', () => {
    it('should validate valid complaint data', () => {
      const data = {
        title: 'Valid Title for Complaint',
        description: 'This is a valid description that meets the minimum character requirement for the complaint form validation',
        category: 'ROADS',
        location: { address: 'Test Address, Mumbai' },
      };

      const result = createComplaintSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject short title', () => {
      const data = {
        title: 'Short',
        description: 'This is a valid description that meets the minimum character requirement for the complaint form validation',
        category: 'ROADS',
        location: { address: 'Test Address' },
      };

      const result = createComplaintSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject short description', () => {
      const data = {
        title: 'Valid Title for Complaint',
        description: 'Too short',
        category: 'ROADS',
        location: { address: 'Test Address' },
      };

      const result = createComplaintSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject invalid category', () => {
      const data = {
        title: 'Valid Title for Complaint',
        description: 'This is a valid description that meets the minimum character requirement',
        category: 'INVALID',
        location: { address: 'Test Address' },
      };

      const result = createComplaintSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('should validate valid registration data', () => {
      const data = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const data = {
        email: 'not-an-email',
        password: 'Password123',
        name: 'Test User',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const data = {
        email: 'test@example.com',
        password: 'short',
        name: 'Test User',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should validate valid login data', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing email', () => {
      const result = loginSchema.safeParse({ password: 'password' });
      expect(result.success).toBe(false);
    });
  });

  describe('complaintQuerySchema', () => {
    it('should validate with defaults', () => {
      const result = complaintQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });

    it('should accept valid filters', () => {
      const result = complaintQuerySchema.safeParse({
        page: 2,
        limit: 20,
        status: 'PENDING',
        category: 'ROADS',
        search: 'pothole',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('updateComplaintSchema', () => {
    it('should require at least one field', () => {
      const result = updateComplaintSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
