'use client';

import React, { useState } from 'react';

import { useParams } from 'next/navigation';

import { getPropertyMonths } from '@/hooks/use-property';
import { IElectricityType } from '@workspace/types';
import {
  formatDate,
  formatEnergy,
  formatVolume,
  isDoubleElectricity,
  isSingleElectricity,
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

  console.log({ data });
  const electricityType = data?.data?.[0]?.meters.electricity.single
    ? IElectricityType.SINGLE
    : IElectricityType.DOUBLE;

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
          {electricityType === IElectricityType.SINGLE && (
            <TableHead>{t('ELECTRICITY')}</TableHead>
          )}
          {electricityType === IElectricityType.DOUBLE && (
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
            {isSingleElectricity(electricityType) && (
              <TableCell>
                {formatEnergy(month?.meters?.electricity?.single)}
              </TableCell>
            )}
            {isDoubleElectricity(electricityType) && (
              <>
                <TableCell>
                  {formatEnergy(month?.meters?.electricity?.day)}
                </TableCell>
                <TableCell>
                  {formatEnergy(month?.meters?.electricity?.night)}
                </TableCell>
              </>
            )}

            <TableCell>{formatVolume(month?.meters?.gas)}</TableCell>
            <TableCell>{formatVolume(month?.meters?.water)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReadingTable;
