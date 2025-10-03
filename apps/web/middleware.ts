// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getCurrentUser } from 'aws-amplify/auth';

export async function middleware(request: NextRequest) {
  const protectedRoutes = ['/dashboard', '/profile']; // Define your protected routes
  console.log(protectedRoutes);
  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    try {
      const user = await getCurrentUser(); // Check if user is authenticated with Cognito
      console.log('user', user);
      return NextResponse.next(); // User is authenticated, proceed
    } catch (error) {
      // User is not authenticated, redirect to login
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next(); // For non-protected routes, proceed
}

// Optional: Define matcher for specific routes
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'], // Apply middleware to dashboard and profile and their sub-paths
};
