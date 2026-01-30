import { Toaster } from '@workspace/ui/components/sonner';
import type { PropsWithChildren } from 'react';

import Header from './header';
import MobileMainMenu from './mobile-menu';
import Sidebar from './sidebar';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className={'flex min-h-dvh flex-col'}>
      <Toaster />
      <Sidebar />
      <MobileMainMenu />
      <Header />
      <div className='relative flex flex-1 p-2 md:p-4 lg:ml-[280px]'>
        <div className='bg-background-2 md:rounded-4xl flex flex-1 flex-col overflow-hidden rounded-3xl p-2 md:p-6'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
