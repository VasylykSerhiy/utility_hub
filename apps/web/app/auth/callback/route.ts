import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { userService } from '@/services/user.service';

export async function GET(request: Request) {
  // Extract search parameters and origin from the request URL
  const { searchParams, origin } = new URL(request.url);

  // Get the authorization code and the 'next' redirect path
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    // Create a Supabase client
    const supabase = await createClient();

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log({ origin, next });
    if (!session) {
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    const { data } = await userService.postAuth({
      token: session?.access_token,
    });

    if (!error && data) {
      // If successful, redirect to the 'next' path or home
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If there's no code or an error occurred, redirect to an error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
