import type { ReactNode } from 'react';

import { AuthLayout } from '@/components/layout';

export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <AuthLayout>{children}</AuthLayout>;
}
