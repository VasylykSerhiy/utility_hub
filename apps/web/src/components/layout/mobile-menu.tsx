'use client';

import React, { useEffect } from 'react';

import Logo from '@/components/logo';
import { useLanguage } from '@/providers/language-provider';
import { Emodal, useModalState } from '@/stores/use-modal-state';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

import Navigations from './navigations';
import { ThemeToggleButton } from './theme-toggle-button';

const MobileHeader = () => {
  const { open, openModal, closeModal } = useModalState(s => ({
    open: s.open,
    openModal: s.openModal,
    closeModal: s.closeModal,
  }));
  const isOpen = open === Emodal.MobileMenu;

  const { language, changeLanguage } = useLanguage();

  const dropdownVariants = {
    hidden: { opacity: 0, y: -20, transition: { duration: 0.2 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }

    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isOpen]);

  return (
    <div className='relative w-full lg:hidden'>
      <header className='relative flex h-[56px] w-full items-center justify-between border-b px-4'>
        <Logo color='black' size={130} />
        <div className='flex items-center gap-2'>
          <Select onValueChange={changeLanguage} value={language}>
            <SelectTrigger className='h-auto gap-0.5 rounded-full py-1.5 font-medium'>
              <SelectValue placeholder='' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='en'>ENG</SelectItem>
              <SelectItem value='uk'>UKR</SelectItem>
            </SelectContent>
          </Select>
          <ThemeToggleButton />
          <button
            onClick={() => {
              if (isOpen) {
                closeModal();
              } else {
                openModal(Emodal.MobileMenu);
              }
            }}
            className='rounded-full p-2 text-gray-600 hover:bg-gray-100'
            aria-label='Відкрити/Закрити меню'
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              variants={backdropVariants}
              initial='hidden'
              animate='visible'
              exit='hidden'
              onClick={closeModal}
              className='bg-background/70 fixed inset-0 z-10'
            />

            <motion.div
              variants={dropdownVariants}
              initial='hidden'
              animate='visible'
              exit='hidden'
              className='bg-background absolute left-0 top-full z-20 w-full overflow-hidden border-b'
            >
              <div className='flex flex-col gap-6 p-4'>
                <Navigations onClick={closeModal} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileHeader;
