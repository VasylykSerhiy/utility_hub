'use client';

import { ReactNode, useContext, useRef } from 'react';

import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePathname } from 'next/navigation';

import { AnimatePresence, motion } from 'framer-motion';

function FrozenRouter(props: Readonly<{ children: ReactNode }>) {
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {props.children}
    </LayoutRouterContext.Provider>
  );
}

const variants = {
  hidden: { opacity: 0, scale: 0.95 },
  enter: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
};

const PageTransitionEffect = ({ children }: { children: ReactNode }) => {
  // The `key` is tied to the url using the `usePathname` hook.
  const key = usePathname();

  return (
    <AnimatePresence mode='popLayout'>
      <motion.div
        key={key}
        initial='hidden'
        animate='enter'
        exit='exit'
        variants={variants}
        transition={{ ease: 'easeInOut', duration: 0.3 }}
        className='flex h-full w-full overflow-hidden'
        style={{ overflow: 'hidden' }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransitionEffect;
