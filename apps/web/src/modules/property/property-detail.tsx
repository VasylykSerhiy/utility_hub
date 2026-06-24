'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Routes } from '@/constants/router';
import { getProperty } from '@/hooks/use-property';
import PropertyAuditLog from '@/modules/property/property-audit-log';
import PropertyChart from '@/modules/property/property-chart';
import PropertyHeader from '@/modules/property/property-header';
import PropertyHistory from '@/modules/property/property-history';
import PropertyMembers from '@/modules/property/property-members';

const PropertyDetail = ({ id }: { id: string }) => {
  const { push } = useRouter();
  const { data, error, isLoading } = getProperty(id);

  useEffect(() => {
    if (error) {
      push(Routes.PROPERTY);
    }
  }, [error, push]);

  if (isLoading || error) {
    return null;
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
