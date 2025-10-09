'use client';

import React from 'react';

import { numericFormatter } from '@workspace/utils';
import { useTranslation } from 'react-i18next';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';

interface IPropertyCardTableProps {
  rows: {
    meter: string;
    reading: number;
    consumption: number;
    const: number;
  }[];
  total?: number;
}

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
