import { ReactNode } from 'react';

import { MainLayout } from '@/components/layout';
import { createClient } from '@/lib/supabase/server';

export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  console.log(data.session?.access_token);
  return (
    <MainLayout>
      <main className='max-w-4xl p-8'>{children}</main>
    </MainLayout>
  );
}
