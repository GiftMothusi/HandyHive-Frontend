// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths that are always public
const publicPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

// Define paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/profile',
  '/bookings',
];


const adminPaths = ['/admin'];
const providerPaths = ['/provider'];

export function middleware(request: NextRequest) {
  // Get the path
  const { pathname } = request.nextUrl;
  
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;

  // Get userType from a secure cookie or localStorage
  // In a real implementation, this would be extracted from a JWT token
  // For demo purposes, we're using a simple check
  const userType = request.cookies.get('userType')?.value;

  // Check if path is admin-only
  const isAdminPath = adminPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // Check if path is provider-only
  const isProviderPath = providerPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // If trying to access admin path and not an admin, redirect to dashboard
  if (isAdminPath && userType !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

   // If trying to access provider path and not a provider, redirect to dashboard
   if (isProviderPath && userType !== 'provider') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  

  
  // Check if path starts with any protected path
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // Check if path is a public auth path
  const isAuthPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // If trying to access protected path without token, redirect to login
  if (isProtectedPath && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }
  
  // If already logged in (have token) and trying to access auth pages, redirect to dashboard
  if (token && isAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files, api routes, etc.
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/admin/:path*',
    '/provider/:path*',
  ],
};