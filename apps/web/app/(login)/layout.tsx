import { ReactNode } from 'react';

import { AuthLayout } from '@/components/layout';
import { createServerClient } from '@/lib/supabase/client';

export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const supabase = await createServerClient();
  const session = await supabase.auth.getSession();
  console.log(session);
  return <AuthLayout>{children}</AuthLayout>;
}
