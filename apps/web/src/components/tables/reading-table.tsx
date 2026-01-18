'use client';

import React, { useCallback, useState } from 'react';

import { useParams } from 'next/navigation';

import { DropdownActions } from '@/components/dropdown-actions';
import {
  getPropertyMonths,
  useDeletePropertyMonth,
} from '@/hooks/use-property';
import { useModalStore } from '@/stores/use-modal-state';
import { IElectricityType, IMonth } from '@workspace/types';
import {
  formatDate,
  formatEnergy,
  formatVolume,
  isDoubleElectricity,
  isSingleElectricity,
} from '@workspace/utils';
import { useTranslation } from 'react-i18next';

import { ButtonProps } from '@workspace/ui/components/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';

const ReadingTable = () => {
  const { openModal, closeModal } = useModalStore();
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const { slug } = useParams();
  const { mutateAsync: deleteMutateAsync, isPending } =
    useDeletePropertyMonth();

  const { data, isLoading } = getPropertyMonths({
    id: slug as string,
    page: page,
    pageSize: 10,
  });

  const electricityType = data?.data?.[0]?.meters.electricity.single
    ? IElectricityType.SINGLE
    : IElectricityType.DOUBLE;

  const actions = useCallback(
    (month: IMonth): ButtonProps[] => [
      {
        children: t('BUTTONS.EDIT'),
        variant: 'ghost',
        onClick: () =>
          openModal('createMeter', {
            id: month?.propertyId,
            meterId: month?.id,
          }),
      },

      {
        children: t('BUTTONS.DELETE'),
        variant: 'destructive',
        onClick: () => {
          openModal('alertModal', {
            title: t('MODALS.DELETE_METER_TITLE'),
            message: t('MODALS.DELETE_METER_MESSAGE'),
            actions: [
              {
                children: t('BUTTONS.CANCEL'),
                variant: 'default',
                onClick: () => closeModal(),
              },
              {
                children: t('BUTTONS.DELETE'),
                variant: 'destructive',
                isLoading: isPending,
                onClick: async () => {
                  await deleteMutateAsync({
                    propertyId: month?.propertyId as string,
                    monthId: month.id!,
                  });
                },
              },
            ],
          });
        },
      },
    ],
    [closeModal, deleteMutateAsync, isPending, openModal, t],
  );

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
          <TableHead className='w-1' />
        </TableRow>
      </TableHeader>
      <TableBody isLoading={isLoading}>
        {data?.data.map(month => (
          <TableRow key={month.id}>
            <TableCell>
              {formatDate({
                date: month.date,
              })}
            </TableCell>
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
            <TableCell>
              <DropdownActions actions={actions(month)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReadingTable;
