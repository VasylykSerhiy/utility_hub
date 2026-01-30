'use client';

import Navigations from './navigations';
import Logo from '@/components/logo';

const Sidebar = () => {
  return (
    <div className='bg-background fixed hidden h-dvh w-[280px] space-y-6 pt-8 lg:block'>
      <div className='px-6'>
        <Logo size={200} />
      </div>

      <Navigations />
    </div>
  );
};

export default Sidebar;
