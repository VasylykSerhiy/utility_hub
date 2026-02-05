'use client';

import { useRouter } from 'next/navigation';

import { Routes } from '@/constants/router';
import { getProperty } from '@/hooks/use-property';
import PropertyAuditLog from '@/modules/property/property-audit-log';
import PropertyChart from '@/modules/property/property-chart';
import PropertyHeader from '@/modules/property/property-header';
import PropertyHistory from '@/modules/property/property-history';
import PropertyMembers from '@/modules/property/property-members';

/** UA: Дані property в кеші з префетчу (SSR), getProperty(id) їх одразу повертає. EN: Property data in cache from prefetch (SSR), getProperty(id) returns it immediately. */
const PropertyDetail = ({ id }: { id: string }) => {
  const { push } = useRouter();
  const { data, error } = getProperty(id);

  if (error) {
    push(Routes.PROPERTY);
  }

  const canEdit = data == null ? undefined : data.role !== 'viewer';
  const isOwner = data?.role === 'owner';

  return (
    <div className='space-y-6'>
      <PropertyHeader id={id} canEdit={canEdit} isLoadingRole={data == null} />
      <PropertyChart />
      <PropertyHistory canEdit={canEdit} />
      {isOwner && (
        <>
          <PropertyMembers propertyId={id} />
          <PropertyAuditLog propertyId={id} />
        </>
      )}
    </div>
  );
};

export default PropertyDetail;
