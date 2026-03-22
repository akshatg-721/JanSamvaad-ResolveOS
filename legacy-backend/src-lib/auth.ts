import { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import * as bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

const authSecret = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev';

if (process.env.NODE_ENV === 'production' && authSecret === 'fallback-secret-for-dev') {
  throw new Error('NEXTAUTH_SECRET must be set in production');
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        }) as any;

        if (!user) {
          throw new Error('No user found with this email');
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error('Account locked. Try again later.');
        }

        const passwordHash = user.password || user.passwordHash;
        const isMatch = passwordHash
          ? await bcrypt.compare(credentials.password, passwordHash)
          : false;

        if (!isMatch) {
          const nextFailedAttempts = (user.failedLoginAttempts || 0) + 1;
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: nextFailedAttempts,
              lockedUntil:
                nextFailedAttempts >= 5
                  ? new Date(Date.now() + 15 * 60 * 1000)
                  : null,
            },
          });
          throw new Error('Invalid password');
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as any).role;
        token.phone = (user as any).phone;
      }
      if (trigger === 'update' && session) {
        token.name = (session as any).name || token.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as string,
          phone: (token as any).phone as string | undefined
        } as any;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 hours
  },
  secret: authSecret
};

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'ADMIN') {
    redirect('/dashboard');
  }
  return user;
}
