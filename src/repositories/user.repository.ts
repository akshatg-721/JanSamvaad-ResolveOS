import prisma from '../lib/prisma';
import { BaseRepository } from './base.repository';
import { User } from '../types';

export class UserRepository extends BaseRepository<User, any, any> {
  constructor() {
    super(prisma.user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.model.findUnique({ where: { email } });
  }

  async updatePassword(id: string, passwordHash: string): Promise<User> {
    return this.update(id, { password: passwordHash } as any);
  }
}

export const userRepository = new UserRepository();
