'use client';

import { AnimatePresence, motion, type Variants } from 'framer-motion';

import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePathname } from 'next/navigation';
import { type ReactNode, useContext, useRef } from 'react';

function FrozenRouter(props: Readonly<{ children: ReactNode }>) {
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {props.children}
    </LayoutRouterContext.Provider>
  );
}

const variants: Variants = {
  hidden: { opacity: 0, filter: 'blur(12px) brightness(0.8)' },
  enter: {
    opacity: 1,
    filter: 'blur(0px) brightness(1)',
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    filter: 'blur(10px) brightness(0.7)',
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
};
const PageTransitionEffect = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode='wait' initial={false}>
      <motion.div
        key={pathname}
        initial='hidden'
        animate='enter'
        exit='exit'
        variants={variants}
        className='flex h-full w-full'
        style={{
          willChange: 'filter, opacity, transform',
          transformOrigin: 'center',
        }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransitionEffect;
