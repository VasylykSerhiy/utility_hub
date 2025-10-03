import { ReactNode } from 'react';

import { RootLayout } from '@/components/layout';
import { Provides } from '@/providers';

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
