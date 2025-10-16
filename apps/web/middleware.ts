import { type NextRequest } from 'next/server';

import { updateSession } from '@/lib/supabase/middleware';
import { Routes } from '@/constants/router';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    return Response.redirect(new URL(Routes.DASHBOARD, request.url));
  }

  if (request.nextUrl.pathname === '/auth') {
    return Response.redirect(new URL(Routes.SING_IN, request.url));
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
