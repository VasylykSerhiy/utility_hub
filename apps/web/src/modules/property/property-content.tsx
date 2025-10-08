'use client';

import React from 'react';

import { getProperties } from '@/hooks/use-property';
import { PropertyCard } from '@/modules/property/property-card';

const PropertyContent = () => {
  const { data } = getProperties();

  return (
    <div className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4'>
      {data?.map(property => (
        <PropertyCard {...property} key={property._id} />
      ))}
    </div>
  );
};

export default PropertyContent;
