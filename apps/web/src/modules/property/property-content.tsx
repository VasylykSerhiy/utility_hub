'use client';

import React from 'react';

import Link from 'next/link';

import { Routes } from '@/constants/router';
import { getProperties } from '@/hooks/use-property';
import { PropertyCard } from '@/modules/property/property-card';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';

const PropertyContent = () => {
  const { data } = getProperties();
  const { t } = useTranslation();

  return (
    <>
      <div className='mb-6 flex items-center justify-between'>
        <Input placeholder={t('SEARCH')} className='max-w-[256px]' />
        <Link href={`${Routes.PROPERTY}/create`}>
          <Button>
            <Plus /> {t('PROPERTY.CREATE.TITLE')}
          </Button>
        </Link>
      </div>
      <div className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4'>
        {data?.map(property => (
          <PropertyCard {...property} key={property.id} />
        ))}
      </div>
    </>
  );
};

export default PropertyContent;
