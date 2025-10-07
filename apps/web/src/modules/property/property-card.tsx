'use client';

import { useTranslation } from 'react-i18next';

export function PropertyCard({ property }: any) {
  const { t, i18n } = useTranslation();

  return (
    <div className='bg-card mb-4 rounded-lg border p-4 shadow'>
      <h3 className='mb-2 text-lg font-semibold'>My home</h3>
      <div className='mb-2'>
        <strong>{t('tariffs')}:</strong>
        <div>• {t('electricity_day')}: 10</div>
        <div>• {t('electricity_night')}: 20</div>
        <div>• {t('water')}: 30</div>
        <div>• {t('gas')}: 40</div>
      </div>
      <div className='mb-2'>
        <strong>{t('fixed_costs')}:</strong>
        <div>• {t('internet')}: 50</div>
        <div>• {t('maintenance')}: 40</div>
      </div>
      <button className='mt-2 rounded bg-green-500 px-3 py-1 text-white'>{t('save')}</button>
    </div>
  );
}
