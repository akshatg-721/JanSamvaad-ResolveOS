import { userRepository } from '../repositories/user.repository';
import { NotFoundError, ConflictError, UnauthorizedError } from '../lib/error-handler';
import { Role } from '../types';
// Note: In real app use actual bcrypt via dynamic imports or node standard
import * as bcrypt from 'bcrypt'; 

export class UserService {
  async register(data: any) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new ConflictError('Email already registered');

    const passwordHash = await bcrypt.hash(data.password, 10);
    return userRepository.create({ ...data, passwordHash, role: Role.USER });
  }

  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    
    const { passwordHash, ...safeProfile } = user as any;
    return safeProfile;
  }

  async updateProfile(userId: string, data: any) {
    const existing = await userRepository.findById(userId);
    if (!existing) throw new NotFoundError('User not found');
    
    return userRepository.update(userId, data);
  }

  async changePassword(userId: string, oldPass: string, newPass: string) {
    const user = await userRepository.findById(userId) as any;
    if (!user) throw new NotFoundError('User not found');

    const isMatch = await bcrypt.compare(oldPass, user.passwordHash);
    if (!isMatch) throw new UnauthorizedError('Incorrect old password');

    const newHash = await bcrypt.hash(newPass, 10);
    await userRepository.updatePassword(userId, newHash);
    return true;
  }
}

export const userService = new UserService();
