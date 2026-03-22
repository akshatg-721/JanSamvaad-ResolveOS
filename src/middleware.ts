import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/demo', req.url));
    }

    if (path.startsWith('/official') && !['ADMIN', 'OFFICIAL'].includes(token?.role as string)) {
      return NextResponse.redirect(new URL('/demo', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        if (
          path === '/' ||
          path === '/login' ||
          path === '/register' ||
          path.startsWith('/api/auth')
        ) {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/demo/:path*',
    '/admin/:path*',
    '/official/:path*',
    '/profile/:path*',
  ]
};
