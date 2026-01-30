'use client';

import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { ModalMap, ModalType } from '@/components/modals/modal-registry';

interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
  props: Record<string, unknown>;

  openModal: <T extends ModalType>(
    type: T,
    props: Omit<ModalMap[T], 'closeModal'>,
  ) => void;

  closeModal: () => void;
}

export const useModalStore = createWithEqualityFn<ModalState>(
  set => ({
    isOpen: false,
    type: null,
    props: {},

    openModal: (type, props) =>
      set({
        isOpen: true,
        type,
        props: props as Record<string, unknown>,
      }),

    closeModal: () => set({ isOpen: false }),
  }),
  shallow,
);
