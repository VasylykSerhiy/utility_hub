'use client';

import React from 'react';

import { useTranslation } from 'react-i18next';

import { Input } from '@workspace/ui/components/input';

const PropertyDetail = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className='mb-6 flex items-center justify-between gap-4'>
        <Input placeholder={t('SEARCH')} className='max-w-[256px]' />
      </div>
    </>
  );
};

export default PropertyDetail;
