'use client';

import React, { useState } from 'react';

import { useParams } from 'next/navigation';

import { getPropertyTariffs } from '@/hooks/use-property';
import { formatCurrencySymbol, formatDate } from '@workspace/utils';
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
          <TableHead>{t('ELECTRICITY_DAY')}</TableHead>
          <TableHead>{t('ELECTRICITY_NIGHT')}</TableHead>
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
              {formatDate({ date: tariff.startDate })}{' '}
              {tariff.endDate
                ? `- ${formatDate({ date: tariff.endDate })}`
                : ''}
            </TableCell>
            <TableCell>
              {formatCurrencySymbol(
                tariff?.tariffs?.electricity?.single ??
                  tariff?.tariffs?.electricity?.day,
              )}
            </TableCell>
            <TableCell>
              {formatCurrencySymbol(tariff?.tariffs?.electricity?.night)}
            </TableCell>
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
