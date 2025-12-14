import React from 'react';

import { MeterCreateForm } from '@/components/forms/meter-create-form';
import { getProperty } from '@/hooks/use-property';
import { useTranslation } from 'react-i18next';

import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@workspace/ui/components/dialog';

export interface CreateMeterProps {
  id: string;
}

const CreateMeter = ({ id }: CreateMeterProps) => {
  const { t } = useTranslation();

  const { data, isLoading } = getProperty(id);

  return (
    <DialogContent className='w-full lg:max-w-[400px]'>
      <DialogTitle>{t('MODAL.CREATE_METER.TITLE')}</DialogTitle>
      <DialogDescription>{t('MODAL.CREATE_METER.DESC')}</DialogDescription>
      {isLoading && <div>Loading...</div>}
      {data && <MeterCreateForm property={data} />}
    </DialogContent>
  );
};

export default CreateMeter;
