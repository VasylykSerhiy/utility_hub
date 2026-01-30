'use client';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { Routes } from '@/constants/router';
import { getProperties } from '@/hooks/use-property';
import { PropertyCard } from '@/modules/property/property-card';

const PropertyContent = () => {
  const { data } = getProperties();
  const { t } = useTranslation();
  return (
    <>
      <div className='mb-6 flex items-center justify-between gap-4'>
        <Input placeholder={t('SEARCH')} className='max-w-[256px]' />
        <Link href={`${Routes.PROPERTY}/create`}>
          <Button>
            <Plus /> {t('PROPERTY.CREATE.TITLE')}
          </Button>
        </Link>
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-[repeat(auto-fill,minmax(400px,1fr))]'>
        {data?.map(property => (
          <PropertyCard {...property} key={property.id} />
        ))}
      </div>
    </>
  );
};

export default PropertyContent;
