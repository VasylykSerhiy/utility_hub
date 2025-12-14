import { ReactNode } from 'react';

import { MainLayout } from '@/components/layout';
import PageTransitionEffect from '@/providers/animate-provider';

export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  console.log('Rendering protected layout');
  return (
    <MainLayout>
      <PageTransitionEffect>
        <main className='w-full'>{children}</main>
      </PageTransitionEffect>
    </MainLayout>
  );
}
