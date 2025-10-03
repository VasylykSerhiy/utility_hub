import { ReactNode } from 'react';

import { MainLayout } from '@/components/layout';

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}
