import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev' });
  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  // If going to login/register while authenticated, redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // If going to dashboard without authentication, redirect to login
  if (isDashboardRoute && !token) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(from)}`, req.url));
  }

  // Role based protection (e.g. /admin routes only for ADMIN role)
  if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register'
  ]
};
