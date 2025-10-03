import { ReactNode } from 'react';

import { AuthLayout } from '@/components/layout';

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <AuthLayout>{children}</AuthLayout>;
}
