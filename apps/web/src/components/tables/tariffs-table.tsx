'use client';

import React, { useState } from 'react';

import { useParams } from 'next/navigation';

import { getPropertyTariffs } from '@/hooks/use-property';
import { ElectricityMeterType } from '@workspace/types';
import {
  formatCurrencySymbol,
  formatDate,
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

const TariffsTable = () => {
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const { slug } = useParams();
  const { data, isLoading } = getPropertyTariffs({
    id: slug as string,
    page: page,
    pageSize: 10,
  });

  const electricityType = data?.data[0]?.tariffs?.electricity
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
          <TableHead>{t('INTERNET')}</TableHead>
          <TableHead>{t('MAINTENANCE')}</TableHead>
          <TableHead>{t('GAS_DELIVERY')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody isLoading={isLoading}>
        {data?.data.map(tariff => (
          <TableRow key={tariff.id}>
            <TableCell>
              {format(new Date(tariff.startDate), formatDate)}{' '}
              {tariff.endDate
                ? `- ${format(new Date(tariff.endDate), formatDate)}`
                : ''}
            </TableCell>
            {isSingleElectricity(tariff?.tariffs?.electricity) && (
              <TableCell>
                {formatCurrencySymbol(tariff?.tariffs?.electricity?.single)}
              </TableCell>
            )}
            {isDoubleElectricity(tariff?.tariffs?.electricity) && (
              <>
                <TableCell>
                  {formatCurrencySymbol(tariff?.tariffs?.electricity?.day)}
                </TableCell>
                <TableCell>
                  {formatCurrencySymbol(tariff?.tariffs?.electricity?.night)}
                </TableCell>
              </>
            )}

            <TableCell>{formatCurrencySymbol(tariff?.tariffs?.gas)}</TableCell>
            <TableCell>
              {formatCurrencySymbol(tariff?.tariffs?.water)}
            </TableCell>
            <TableCell>
              {formatCurrencySymbol(tariff?.fixedCosts?.internet)}
            </TableCell>
            <TableCell>
              {formatCurrencySymbol(tariff?.fixedCosts?.maintenance)}
            </TableCell>
            <TableCell>
              {formatCurrencySymbol(tariff?.fixedCosts?.gas_delivery)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TariffsTable;
