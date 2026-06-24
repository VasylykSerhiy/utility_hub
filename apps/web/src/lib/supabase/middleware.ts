import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

import { Routes } from '@/constants/router';

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname.startsWith('/auth');
  const isPublicAuthRoute = pathname.startsWith('/auth/confirm') || pathname.startsWith('/auth/error');

  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = Routes.SING_IN;
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute && !isPublicAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = Routes.DASHBOARD;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
