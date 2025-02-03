// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths that are always public
const publicPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
];

// Define paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/profile',
  '/bookings',
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Helper to check if path starts with any of the given paths
  const pathStartsWith = (paths: string[]) => 
    paths.some(path => pathname.startsWith(path));

  // Check if this is an API route that's not auth-related
  const isProtectedApiRoute = pathname.startsWith('/api/') && 
    !pathname.startsWith('/api/auth/');

  // If it's a protected API route and no token, return 401
  if (isProtectedApiRoute && !token) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  // If we have a token and try to access auth pages, redirect to dashboard
  if (token && pathStartsWith(publicPaths)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If we don't have a token and try to access protected pages, redirect to login
  if (!token && pathStartsWith(protectedPaths)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
    '/api/:path*',
  ],
};