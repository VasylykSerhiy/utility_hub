import { ReactNode } from 'react';

import { MainLayout } from '@/components/layout';
import PageTransitionEffect from '@/providers/animate-provider';

export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <MainLayout>
      <PageTransitionEffect>
        <main className='w-full'>{children}</main>
      </PageTransitionEffect>
    </MainLayout>
  );
}
