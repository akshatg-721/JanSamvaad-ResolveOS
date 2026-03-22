/* eslint-disable no-unused-vars */
import type { DefaultSession, DefaultUser } from 'next-auth';
import type { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;
    email: string;
    name: string;
    role: string;
    phone?: string | null;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      phone?: string | null;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    email: string;
    name: string;
    role: string;
  }
}
