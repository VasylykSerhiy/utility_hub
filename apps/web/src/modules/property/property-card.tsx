'use client';

import { useMemo } from 'react';

import PropertyCardTable from '@/components/tables/property-card-table';
import { IPropertyWithLastMonth } from '@workspace/types';
import { formatDate, numericFormatter } from '@workspace/utils';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';

export function PropertyCard({
  fixedCosts,
  lastMonth,
  tariffs,
  name,
  electricityType,
}: IPropertyWithLastMonth) {
  const { t } = useTranslation();

  const [rows, total] = useMemo(() => {
    const rows = [
      ...(electricityType === 'single'
        ? [
            {
              meter: t('ELECTRICITY'),
              reading: lastMonth?.meters?.electricity?.single ?? 0,
              consumption: lastMonth?.difference?.electricity?.single ?? 0,
              const:
                (lastMonth?.difference?.electricity?.single ?? 0) *
                (lastMonth?.tariffs?.electricity?.single ?? 0),
            },
          ]
        : []),

      ...(electricityType === 'double'
        ? [
            {
              meter: t('ELECTRICITY_DAY'),
              reading: lastMonth?.meters?.electricity?.day ?? 0,
              consumption: lastMonth?.difference?.electricity?.day ?? 0,
              const:
                (lastMonth?.difference?.electricity?.day ?? 0) *
                (lastMonth?.tariffs?.electricity?.day ?? 0),
            },
            {
              meter: t('ELECTRICITY_NIGHT'),
              reading: lastMonth?.meters?.electricity?.night ?? 0,
              consumption: lastMonth?.difference?.electricity?.night ?? 0,
              const:
                (lastMonth?.difference?.electricity?.night ?? 0) *
                (lastMonth?.tariffs?.electricity?.night ?? 0),
            },
          ]
        : []),
      {
        meter: t('WATER'),
        reading: lastMonth?.meters?.water ?? 0,
        consumption: lastMonth?.difference?.water ?? 0,
        const:
          (lastMonth?.difference?.water ?? 0) *
          (lastMonth?.tariffs?.water ?? 0),
      },
      {
        meter: t('GAS'),
        reading: lastMonth?.meters?.gas ?? 0,
        consumption: lastMonth?.difference?.gas ?? 0,
        const:
          (lastMonth?.difference?.gas ?? 0) * (lastMonth?.tariffs?.gas ?? 0),
      },
    ];

    const total =
      rows.reduce((acc, row) => acc + row.const, 0) +
      Object.values(lastMonth?.fixedCosts ?? []).reduce((acc, c) => acc + c, 0);
    return [rows, total];
  }, [lastMonth, tariffs, electricityType, t]);

  return (
    <Card className='border border-gray-700 shadow-lg transition-shadow duration-300 hover:shadow-xl'>
      <CardHeader className='flex items-center justify-between'>
        <CardTitle className='text-lg font-semibold'>{name}</CardTitle>
        {lastMonth?.date && <p>{format(lastMonth?.date, formatDate)}</p>}
      </CardHeader>
      <CardContent className='space-y-2'>
        <div>
          <span className='font-medium'>{t('METERS')}:</span>
          <div className='ml-2'>
            <PropertyCardTable rows={rows} />
          </div>
        </div>
        <hr />
        <div>
          <span className='font-medium'>{t('FIXED_COSTS')}:</span>
          <div className='ml-2'>
            {[
              {
                label: t('INTERNET'),
                value: numericFormatter(fixedCosts.internet, { suffix: ' ₴' }),
              },
              {
                label: t('MAINTENANCE'),
                value: numericFormatter(fixedCosts.maintenance, {
                  suffix: ' ₴',
                }),
              },
              {
                label: t('GAS_DELIVERY'),
                value: numericFormatter(fixedCosts.gas_delivery, {
                  suffix: ' ₴',
                }),
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
            {numericFormatter(total, {
              suffix: ' ₴',
            })}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <div className='grid w-full grid-cols-2 gap-2'>
          <Button className='w-full'>{t('BUTTONS.MORE')}</Button>
          <Button className='w-full'>{t('BUTTONS.ADD_METER')}</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
