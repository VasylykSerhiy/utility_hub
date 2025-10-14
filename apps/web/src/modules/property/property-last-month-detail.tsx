'use client';

import React from 'react';

import MeterTable from '@/components/tables/meter-table';
import { IMonth } from '@workspace/types';
import { formatDate, numericFormatter } from '@workspace/utils';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import {
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';

interface PropertyLastMonthDetailProps {
  name?: string;
  lastMonth: IMonth;
  isLoading?: boolean;
}

const LoadingSkeleton = ({ hasName }: { hasName: boolean }) => {
  const { t } = useTranslation();
  return (
    <div className='flex flex-col gap-6'>
      {hasName && (
        <CardHeader className='flex items-center justify-between'>
          <CardTitle className='text-lg font-semibold'>
            <Skeleton className='h-7 w-20' />
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className='space-y-2'>
        <div>
          <span className='font-medium'>{t('METERS')}:</span>
          <div className='ml-2'>
            <Skeleton className='h-6 w-full' />
            <Skeleton className='mt-2 h-6 w-full' />
            <Skeleton className='mt-2 h-6 w-full' />
          </div>
        </div>
        <hr />
        <div>
          <span className='font-medium'>{t('FIXED_COSTS')}:</span>
          <div className='ml-2'>
            <Skeleton className='mt-2 h-6 w-full' />
            <Skeleton className='mt-2 h-6 w-full' />
            <Skeleton className='mt-2 h-6 w-full' />
          </div>
        </div>

        <hr />

        <div className='flex justify-between gap-1 pt-2'>
          <span className='font-medium'>{t('TOTAL')}:</span>
          <span className='font font-medium'>
            <Skeleton className='h-6 w-20' />
          </span>
        </div>
      </CardContent>
    </div>
  );
};

const PropertyLastMonthDetail = ({
  name,
  lastMonth,
  isLoading,
}: PropertyLastMonthDetailProps) => {
  const { t } = useTranslation();

  if (isLoading) return <LoadingSkeleton hasName={!!name} />;

  return (
    <div className='flex flex-col gap-6'>
      {name && (
        <CardHeader className='flex items-center justify-between'>
          <CardTitle className='text-lg font-semibold'>{name}</CardTitle>
          {lastMonth?.date && <p>{format(lastMonth?.date, formatDate)}</p>}
        </CardHeader>
      )}
      <CardContent className='space-y-2'>
        <div>
          <span className='text-lg font-medium'>{t('METERS')}:</span>
          <div className='ml-2'>
            <MeterTable lastMonth={lastMonth} />
          </div>
        </div>
        <hr />
        <div>
          <span className='text-lg font-medium'>{t('FIXED_COSTS')}:</span>
          <div className='ml-2'>
            {[
              {
                label: t('INTERNET'),
                value: numericFormatter(
                  lastMonth.tariff?.fixedCosts?.internet,
                  {
                    suffix: ' ₴',
                  },
                ),
              },
              {
                label: t('MAINTENANCE'),
                value: numericFormatter(
                  lastMonth.tariff?.fixedCosts?.maintenance,
                  {
                    suffix: ' ₴',
                  },
                ),
              },
              {
                label: t('GAS_DELIVERY'),
                value: numericFormatter(
                  lastMonth.tariff?.fixedCosts?.gas_delivery,
                  {
                    suffix: ' ₴',
                  },
                ),
              },
            ].map(item => (
              <div className='flex justify-between gap-1' key={item.label}>
                <p>{item.label}</p>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <hr />

        <div className='flex justify-between gap-1 pt-2'>
          <span className='font-medium'>{t('TOTAL')}:</span>
          <span className='font-medium'>
            {numericFormatter(lastMonth?.total, {
              suffix: ' ₴',
            })}
          </span>
        </div>
      </CardContent>
    </div>
  );
};

export default PropertyLastMonthDetail;
