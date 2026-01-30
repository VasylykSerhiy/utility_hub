'use client';

import { type ComponentType, Suspense } from 'react';

import { Dialog } from '@workspace/ui/components/dialog';

import { useModalStore } from '@/stores/use-modal-state';
import {
  ModalComponents,
  type ModalMap,
} from '@/components/modals/modal-registry';

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
