import { ReactNode } from 'react';

import { AuthLayout } from '@/components/layout';
import { createClient } from '@/lib/supabase/server';

export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();

  console.log(data?.session);

  if (data.session) {
    // redirect to dashboard
    // not working, need to fix it later
    // redirect('/dashboard');
  }

  return <AuthLayout>{children}</AuthLayout>;
}
