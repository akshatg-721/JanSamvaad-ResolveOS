'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UnauthorizedError } from '@/lib/api-client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      if (event.reason instanceof UnauthorizedError || event.reason?.name === 'UnauthorizedError') {
        event.preventDefault(); // Mute the crash
        if (!pathname?.startsWith('/login')) {
          router.push('/login');
        }
      }
    };

    window.addEventListener('unhandledrejection', handleRejection);
    return () => window.removeEventListener('unhandledrejection', handleRejection);
  }, [router, pathname]);

  return <>{children}</>;
}
