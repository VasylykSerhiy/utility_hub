'use client';

import React from 'react';

import { IMonth } from '@workspace/types';
import {
  isDoubleMonth,
  isSingleMonth,
  numericFormatter,
} from '@workspace/utils';
import { useTranslation } from 'react-i18next';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';

interface Row {
  meter: string;
  reading: number;
  consumption: number;
  const: number;
}

interface IPropertyCardTableProps {
  rows: Row[];
  total?: number;
}

export const generateRows = (
  lastMonth: IMonth,
  t: (key: string) => string,
): Row[] => {
  const tariffs = lastMonth?.tariff?.tariffs ?? {};
  const meters = lastMonth?.meters ?? {};
  const diff = lastMonth?.difference ?? {};

  const rows: Row[] = [];

  if (isSingleMonth(lastMonth)) {
    const consumption = lastMonth?.difference?.electricity?.single ?? 0;
    rows.push({
      meter: t('ELECTRICITY'),
      reading: lastMonth?.meters?.electricity?.single ?? 0,
      consumption,
      const:
        consumption * (lastMonth?.tariff?.tariffs?.electricity?.single ?? 0),
    });
  } else if (isDoubleMonth(lastMonth)) {
    (['day', 'night'] as const).forEach(period => {
      const consumption = lastMonth?.difference?.electricity?.[period] ?? 0;
      rows.push({
        meter: t(`ELECTRICITY_${period.toUpperCase()}`),
        reading: lastMonth?.meters?.electricity?.[period] ?? 0,
        consumption,
        const:
          consumption *
          (lastMonth?.tariff?.tariffs?.electricity?.[period] ?? 0),
      });
    });
  }

  // 💧 Вода
  const waterConsumption = diff.water ?? 0;
  rows.push({
    meter: t('WATER'),
    reading: meters.water ?? 0,
    consumption: waterConsumption,
    const: waterConsumption * (tariffs.water ?? 0),
  });

  // 🔥 Газ
  const gasConsumption = diff.gas ?? 0;
  rows.push({
    meter: t('GAS'),
    reading: meters.gas ?? 0,
    consumption: gasConsumption,
    const: gasConsumption * (tariffs.gas ?? 0),
  });

  return rows;
};

const PropertyCardTable = ({ rows }: IPropertyCardTableProps) => {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[100px]'>{t('METER')}</TableHead>
          <TableHead>{t('READING')}</TableHead>
          <TableHead>{t('CONSUMPTION')}</TableHead>
          <TableHead className='text-right'>{t('COSTS')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows?.map(row => (
          <TableRow className='w-full' key={row.meter}>
            <TableCell className='font-medium'>{row.meter}</TableCell>
            <TableCell>{numericFormatter(row.reading)}</TableCell>
            <TableCell>{numericFormatter(row.consumption)}</TableCell>
            <TableCell className='text-right'>
              {numericFormatter(row.const, { suffix: ' ₴' })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PropertyCardTable;
