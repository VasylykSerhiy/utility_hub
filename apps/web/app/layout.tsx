import MainLayout from '@/components/layout';
import RootLayout from '@/components/layout/root';
import { Provides } from '@/providers';

import '@workspace/ui/globals.css';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootLayout>
      <Provides>
        <MainLayout>{children}</MainLayout>
      </Provides>
    </RootLayout>
  );
}
