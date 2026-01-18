'use client';

import { Suspense } from 'react';

import { ModalComponents } from '@/components/modals/modal-registry';
import { useModalStore } from '@/stores/use-modal-state';

import { Dialog } from '@workspace/ui/components/dialog';

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

  const SpecificModal = ModalComponents[type];

  return (
    isOpen && (
      <Dialog open={true} onOpenChange={handleOpenChange}>
        <Suspense fallback={null}>
          <SpecificModal {...(props as any)} />
        </Suspense>
      </Dialog>
    )
  );
};
