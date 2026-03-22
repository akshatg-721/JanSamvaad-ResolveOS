import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import 'whatwg-fetch';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}));

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
      },
    },
    status: 'authenticated',
  }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  signIn: vi.fn(),
  signOut: vi.fn(),
  getServerSession: vi.fn(),
}));

// Mock next-auth server
vi.mock('next-auth', () => ({
  default: vi.fn(),
  getServerSession: vi.fn(() =>
    Promise.resolve({
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
      },
    })
  ),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
  Toaster: () => null,
}));
