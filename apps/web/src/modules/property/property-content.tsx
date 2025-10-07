import React from 'react';

import { PropertyCard } from '@/modules/property/property-card';

const PropertyContent = () => {
  return (
    <div className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4'>
      <PropertyCard />
    </div>
  );
};

export default PropertyContent;
