import React from 'react';

import { MeterCreateForm } from '@/components/forms/meter-create-form';
import { getProperty, getPropertyMonth } from '@/hooks/use-property';
import { IMonth } from '@workspace/types';
import { useTranslation } from 'react-i18next';

import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@workspace/ui/components/dialog';

export interface CreateMeterProps {
  id: string;
  meterId?: IMonth['id'];
}

const CreateMeter = ({ id, meterId }: CreateMeterProps) => {
  const { t } = useTranslation();
  const { data, isLoading: isPropertyLoading } = getProperty(id);
  const { data: monthData, isLoading: monthLoading } = getPropertyMonth({
    propertyId: id,
    monthId: meterId || '',
  });

  const isLoading = isPropertyLoading || monthLoading;

  return (
    <DialogContent className='w-full lg:max-w-[400px]'>
      <DialogTitle>{t('MODAL.CREATE_METER.TITLE')}</DialogTitle>
      <DialogDescription>{t('MODAL.CREATE_METER.DESC')}</DialogDescription>
      {isLoading && <div>Loading...</div>}
      {data && !isLoading && (
        <MeterCreateForm property={data} meter={monthData} />
      )}
    </DialogContent>
  );
};

export default CreateMeter;
