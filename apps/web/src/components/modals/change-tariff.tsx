import React from 'react';

import { ChangeTariffForm } from '@/components/forms/tariff-change-form';
import { getProperty } from '@/hooks/use-property';
import { useModalState } from '@/stores/use-modal-state';
import { useTranslation } from 'react-i18next';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@workspace/ui/components/dialog';

const ChangeTariff = () => {
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
        <DialogTitle>{t('MODAL.CHANGE_TARIFF.TITLE')}</DialogTitle>
        <DialogDescription>{t('MODAL.CHANGE_TARIFF.DESC')}</DialogDescription>
        {data && !isLoading && <ChangeTariffForm property={data} />}
      </DialogContent>
    </Dialog>
  );
};

export default ChangeTariff;
