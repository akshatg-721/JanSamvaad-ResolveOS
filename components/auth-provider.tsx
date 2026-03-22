'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { UnauthorizedError } from '@/lib/api-client';
import { clearToken } from '@/lib/api-client';

// ── React Error Boundary ──────────────────────────────────────────────────────
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class GlobalErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] text-[#F8F5F0] p-8">
          <div className="max-w-md text-center">
            <div className="text-6xl mb-6">⚠️</div>
            <h2 className="text-2xl font-light mb-4">Something went wrong</h2>
            <p className="text-[#8E8A80] text-sm mb-8">{this.state.error?.message || 'An unexpected error occurred.'}</p>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
              className="px-6 py-3 bg-[#A3C9AA] text-black text-sm font-medium rounded-full hover:bg-[#A3C9AA]/80 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Auth Interceptor ──────────────────────────────────────────────────────────
function AuthInterceptor({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const handleUnauthorized = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.type === 'unauthorized') {
        clearToken();
        toast.error('Session expired. Please log in again.', { duration: 4000 });
        router.push('/login');
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason instanceof UnauthorizedError) {
        clearToken();
        toast.error('Session expired. Please log in again.', { duration: 4000 });
        router.push('/login');
        event.preventDefault();
      } else if (event.reason instanceof Error) {
        // Show non-auth errors as toasts rather than silent failures
        toast.error(event.reason.message || 'An unexpected error occurred.');
        event.preventDefault();
      }
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [router]);

  return <>{children}</>;
}

import { SessionProvider } from 'next-auth/react';

// ── AuthProvider (exported) ───────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <GlobalErrorBoundary>
        <AuthInterceptor>
          {children}
        </AuthInterceptor>
      </GlobalErrorBoundary>
    </SessionProvider>
  );
}
