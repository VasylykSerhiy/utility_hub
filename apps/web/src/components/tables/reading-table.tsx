'use client';

import React, { useState } from 'react';

import { useParams } from 'next/navigation';

import { getPropertyMonths } from '@/hooks/use-property';
import { ElectricityMeterType } from '@workspace/types';
import {
  formatDate,
  isDoubleMonth,
  isSingleMonth,
  numericFormatter,
} from '@workspace/utils';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';

const ReadingTable = () => {
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const { slug } = useParams();
  const { data, isLoading } = getPropertyMonths({
    id: slug as string,
    page: page,
    pageSize: 10,
  });

  const electricityType = data?.data[0]?.meters?.electricity
    ?.type as ElectricityMeterType;

  return (
    <Table
      withPagination
      handlePage={setPage}
      page={page}
      totalPages={data?.totalPages || 1}
    >
      <TableHeader>
        <TableRow>
          <TableHead>{t('DATE')}</TableHead>
          {electricityType === ElectricityMeterType.SINGLE && (
            <TableHead>{t('ELECTRICITY')}</TableHead>
          )}
          {electricityType === ElectricityMeterType.DOUBLE && (
            <>
              <TableHead>{t('ELECTRICITY_DAY')}</TableHead>
              <TableHead>{t('ELECTRICITY_NIGHT')}</TableHead>
            </>
          )}
          <TableHead>{t('GAS')}</TableHead>
          <TableHead>{t('WATER')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody isLoading={isLoading}>
        {data?.data.map(month => (
          <TableRow key={month.id}>
            <TableCell>{format(new Date(month.date), formatDate)}</TableCell>
            {isSingleMonth(month) && (
              <TableCell>
                {numericFormatter(month?.meters?.electricity?.single)}
              </TableCell>
            )}
            {isDoubleMonth(month) && (
              <>
                <TableCell>
                  {numericFormatter(month?.meters?.electricity?.day)}
                </TableCell>
                <TableCell>
                  {numericFormatter(month?.meters?.electricity?.night)}
                </TableCell>
              </>
            )}

            <TableCell>{numericFormatter(month?.meters?.gas)}</TableCell>
            <TableCell>{numericFormatter(month?.meters?.water)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReadingTable;
