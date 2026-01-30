'use client';

import { Dialog } from '@workspace/ui/components/dialog';
import type { ComponentType } from 'react';
import { Suspense } from 'react';
import {
  ModalComponents,
  type ModalMap,
} from '@/components/modals/modal-registry';
import { useModalStore } from '@/stores/use-modal-state';

export const ModalsProvider = () => {
  const { isOpen, type, props, closeModal } = useModalStore(state => ({
    isOpen: state.isOpen,
    type: state.type,
    props: state.props,
    closeModal: state.closeModal,
  }));

  const handleOpenChange = (open: boolean) => {
    if (!open) closeModal();
  };

  if (!type) return null;

  const SpecificModal = ModalComponents[type] as ComponentType<
    ModalMap[typeof type]
  >;

  return (
    isOpen && (
      <Dialog open={true} onOpenChange={handleOpenChange}>
        <Suspense fallback={null}>
          <SpecificModal {...(props as unknown as ModalMap[typeof type])} />
        </Suspense>
      </Dialog>
    )
  );
};
