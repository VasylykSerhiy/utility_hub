import React from 'react';

import { MeterCreateForm } from '@/components/forms/meter-create-form';
import { getProperty } from '@/hooks/use-property';
import { useModalState } from '@/stores/use-modal-state';
import { useTranslation } from 'react-i18next';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@workspace/ui/components/dialog';

const CreateMeter = () => {
  const { t } = useTranslation();

  const {
    closeModal,
    args: { id },
  } = useModalState(s => ({
    closeModal: s.closeModal,
    args: s.args,
  }));

  const { data, isLoading } = getProperty(id!);

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='w-full lg:max-w-[400px]'>
        <DialogTitle>{t('MODAL.CREATE_METER.TITLE')}</DialogTitle>
        <DialogDescription>{t('MODAL.CREATE_METER.DESC')}</DialogDescription>
        {isLoading && <div>Loading...</div>}
        {data && <MeterCreateForm property={data} />}
      </DialogContent>
    </Dialog>
  );
};

export default CreateMeter;
