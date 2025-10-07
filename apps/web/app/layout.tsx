import { ReactNode } from 'react';

import { Metadata } from 'next';

import { RootLayout } from '@/components/layout';
import { Provides } from '@/providers';

export const metadata: Metadata = {
  title: 'Utility Hub',
  description: 'Manage your properties with ease',
};

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <RootLayout>
      <Provides>{children}</Provides>
    </RootLayout>
  );
}
