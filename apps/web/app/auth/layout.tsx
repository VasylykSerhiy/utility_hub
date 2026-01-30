import type { ReactNode } from 'react';

import { AuthLayout } from '@/components/layout';

export default function Layout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
