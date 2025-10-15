'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { Routes } from '@/constants/router';
import { getProperty } from '@/hooks/use-property';
import PropertyChart from '@/modules/property/property-chart';
import PropertyHeader from '@/modules/property/property-header';
import PropertyHistory from '@/modules/property/property-history';

const PropertyDetail = ({ id }: { id: string }) => {
  const { push } = useRouter();
  const { error } = getProperty(id);

  if (error) {
    push(Routes.PROPERTY);
  }

  return (
    <div className='space-y-6'>
      <PropertyHeader id={id} />
      <PropertyChart />
      <PropertyHistory />
    </div>
  );
};

export default PropertyDetail;
