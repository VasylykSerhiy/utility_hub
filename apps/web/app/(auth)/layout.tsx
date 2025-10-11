import { ReactNode } from 'react';

import { MainLayout } from '@/components/layout';
import { createClient } from '@/lib/supabase/server';
import PageTransitionEffect from '@/providers/animate-provider';

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
      <PageTransitionEffect>
        <main className='w-full'>{children}</main>
      </PageTransitionEffect>
    </MainLayout>
  );
}
