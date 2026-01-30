import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { useTranslation } from 'react-i18next';
import { ChangeTariffForm } from '@/components/forms/tariff-change-form';
import { getProperty } from '@/hooks/use-property';

export interface ChangeTariffProps {
  id: string;
}

const ChangeTariff = ({ id }: ChangeTariffProps) => {
  const { t } = useTranslation();

  const { data, isLoading } = getProperty(id);

  return (
    <DialogContent className='w-full lg:max-w-[400px]'>
      <DialogTitle>{t('MODAL.CHANGE_TARIFF.TITLE')}</DialogTitle>
      <DialogDescription>{t('MODAL.CHANGE_TARIFF.DESC')}</DialogDescription>
      {data && !isLoading && <ChangeTariffForm property={data} />}
    </DialogContent>
  );
};

export default ChangeTariff;
