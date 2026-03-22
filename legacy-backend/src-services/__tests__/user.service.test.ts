import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockPrisma } from '@/test/mock-prisma';
import { createMockUser } from '@/test/factories';

// Mock bcrypt
vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password'),
    compare: vi.fn().mockResolvedValue(true),
  },
}));

// Import after mocks
import { UserService } from '../user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new UserService(mockPrisma as any);
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const mockUser = createMockUser({ email: 'new@example.com' });
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(mockUser);

      const result = await service.registerUser(
        'new@example.com',
        'Password123',
        'New User',
        '+91 98765 43210'
      );

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'new@example.com' },
      });
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
    });

    it('should throw error if user already exists', async () => {
      const existingUser = createMockUser();
      mockPrisma.user.findUnique.mockResolvedValue(existingUser);

      await expect(
        service.registerUser('existing@example.com', 'Password123', 'User')
      ).rejects.toThrow('User already exists');
    });

    it('should throw error if password is too short', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.registerUser('new@example.com', 'short', 'User')
      ).rejects.toThrow();
    });
  });

  describe('getUserByEmail', () => {
    it('should return user without password', async () => {
      const mockUser = createMockUser();
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getUserByEmail('test@example.com');

      expect(result).toBeDefined();
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: expect.objectContaining({
          id: true,
          email: true,
          name: true,
        }),
      });
    });

    it('should return null if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await service.getUserByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('isUserLocked', () => {
    it('should return true if user is locked', async () => {
      const futureDate = new Date(Date.now() + 15 * 60 * 1000);
      mockPrisma.user.findUnique.mockResolvedValue({
        lockedUntil: futureDate,
      });

      const result = await service.isUserLocked('locked@example.com');
      expect(result).toBe(true);
    });

    it('should return false if lock expired', async () => {
      const pastDate = new Date(Date.now() - 1000);
      mockPrisma.user.findUnique.mockResolvedValue({
        lockedUntil: pastDate,
      });
      mockPrisma.user.update.mockResolvedValue({});

      const result = await service.isUserLocked('expired@example.com');
      expect(result).toBe(false);
    });

    it('should return false if user has no lock', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        lockedUntil: null,
      });

      const result = await service.isUserLocked('normal@example.com');
      expect(result).toBe(false);
    });
  });
});
