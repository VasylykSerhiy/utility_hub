'use client';

import { ReactNode } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@workspace/ui/lib/utils';

type Tab = {
  label: string;
  id: string;
  content?: ReactNode;
};

type Props = {
  className?: string;
  classNameTab?: string;
  tabs: Tab[];
  activeTabId: string;
  onTabChangeAction: (id: string) => void;
};

export default function Tabs({
  tabs,
  className,
  classNameTab,
  activeTabId,
  onTabChangeAction,
}: Props) {
  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  return (
    <div>
      <div className={cn('mb-6 flex gap-4 border-b', className)}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChangeAction(tab.id)}
            className={cn(
              '-mb-[1px] cursor-pointer px-1 pb-3 text-sm font-semibold md:text-base',
              tab.id === activeTab?.id
                ? 'text-primary border-primary border-b-2'
                : 'border-b-2 border-transparent',
              classNameTab,
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className='relative'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTab?.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
