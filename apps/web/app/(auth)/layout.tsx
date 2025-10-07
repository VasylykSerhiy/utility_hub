import { ReactNode } from 'react';

import { MainLayout } from '@/components/layout';
import PropertyContent from '@/modules/property/property-content';

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <MainLayout>
      <main className='max-w-4xl p-8'>{children}</main>
    </MainLayout>
  );
}
