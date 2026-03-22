import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';
import { UnauthorizedError, ForbiddenError } from './error-handler';
import { Role } from '../types';
import * as bcrypt from 'bcrypt';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user as { id: string; name: string; email: string; role: Role } | undefined;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthorizedError('You must be logged in to access this resource');
  }
  return user;
}

export async function requireRole(allowedRoles: Role[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new ForbiddenError('You do not have permission to access this resource');
  }
  return user;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
