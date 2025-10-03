import React, { type PropsWithChildren } from 'react';

import { Toaster } from '@workspace/ui/components/sonner';

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
      <div className='relative flex flex-1 p-4 lg:ml-[280px]'>
        <div className='bg-background-2 rounded-4xl flex flex-1 flex-col overflow-hidden p-4 lg:p-6'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
