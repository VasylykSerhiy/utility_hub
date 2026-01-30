import type { PropsWithChildren } from 'react';

import Logo from '@/components/logo';

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
        <div className='mb-4 flex items-center justify-center'>
          <Logo size={200} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
