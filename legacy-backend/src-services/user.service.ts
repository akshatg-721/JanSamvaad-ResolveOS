import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export class UserService {
  constructor(private db: PrismaClient = prisma) {}

  async registerUser(
    email: string,
    password: string,
    name: string,
    phone?: string
  ) {
    const existingUser = await this.db.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('User already exists');

    if (password.length < 8) throw new Error('Password must be 8+ chars');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone: phone || null,
        role: 'USER',
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async verifyPassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }

  async getUserByEmail(email: string) {
    return this.db.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
    });
  }

  async getUserById(id: string) {
    return this.db.user.findUnique({
      where: { id },
      include: {
        complaints: { select: { id: true, title: true, status: true, createdAt: true } },
        _count: { select: { complaints: true } },
      },
    });
  }

  async updateUserProfile(id: string, updates: { name?: string; phone?: string }) {
    return this.db.user.update({
      where: { id },
      data: updates,
      select: { id: true, email: true, name: true, phone: true, role: true, updatedAt: true },
    });
  }

  async changePassword(id: string, oldPassword: string, newPassword: string) {
    const user = await this.db.user.findUnique({
      where: { id },
      select: { password: true },
    });

    if (!user) throw new Error('User not found');
    if (!(await this.verifyPassword(oldPassword, user.password))) throw new Error('Invalid password');
    if (newPassword.length < 8) throw new Error('Password must be 8+ chars');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.db.user.update({
      where: { id },
      data: { password: hashedPassword },
      select: { id: true, email: true, name: true, updatedAt: true },
    });
  }

  async recordFailedLogin(email: string) {
    const user = await this.db.user.findUnique({
      where: { email },
      select: { id: true, failedLoginAttempts: true },
    });

    if (!user) return;

    const newFailedAttempts = (user.failedLoginAttempts || 0) + 1;
    if (newFailedAttempts >= 5) {
      await this.db.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: newFailedAttempts,
          lockedUntil: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
    } else {
      await this.db.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: newFailedAttempts },
      });
    }
  }

  async recordSuccessfulLogin(id: string) {
    return this.db.user.update({
      where: { id },
      data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    });
  }

  async isUserLocked(email: string) {
    const user = await this.db.user.findUnique({
      where: { email },
      select: { lockedUntil: true },
    });

    if (!user?.lockedUntil) return false;
    if (user.lockedUntil < new Date()) {
      await this.db.user.update({
        where: { email },
        data: { lockedUntil: null, failedLoginAttempts: 0 },
      });
      return false;
    }
    return true;
  }
}

export const userService = new UserService();
