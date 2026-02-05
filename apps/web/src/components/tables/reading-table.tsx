'use client';

import { useCallback, useState } from 'react';

import { IElectricityType, type IMonth } from '@workspace/types';
import type { ButtonProps } from '@workspace/ui/components/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import {
  formatDate,
  formatEnergy,
  formatVolume,
  isDoubleElectricity,
  isSingleElectricity,
} from '@workspace/utils';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { DropdownActions } from '@/components/dropdown-actions';
import { getPropertyMonths, useDeletePropertyMonth } from '@/hooks/use-property';
import { useModalStore } from '@/stores/use-modal-state';

/** canEdit: true = owner, false = viewer, undefined = loading (no actions column). */
const ReadingTable = ({ canEdit }: { canEdit?: boolean }) => {
  const { openModal, closeModal } = useModalStore();
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const { slug } = useParams();
  const { mutateAsync: deleteMutateAsync, isPending } = useDeletePropertyMonth();

  const { data, isLoading } = getPropertyMonths({
    id: slug as string,
    page: page,
    pageSize: 10,
  });

  const electricityType = data?.data?.[0]?.meters.electricity.single
    ? IElectricityType.SINGLE
    : IElectricityType.DOUBLE;

  const showActions = canEdit === true;
  const actions = useCallback(
    (month: IMonth): ButtonProps[] =>
      !showActions
        ? []
        : [
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
            title: t('MODALS.ALERT.TITLE.DELETE_METER'),
            message: t('MODALS.ALERT.MESSAGE.DELETE_METER'),
            actions: [
              {
                children: t('BUTTONS.DELETE'),
                variant: 'destructive',
                isLoading: isPending,
                onClick: async () => {
                  if (!month?.id || !month?.propertyId) return;
                  await deleteMutateAsync({
                    propertyId: month.propertyId,
                    monthId: month.id,
                  });
                  closeModal();
                },
              },
              {
                children: t('BUTTONS.CANCEL'),
                variant: 'default',
                onClick: () => closeModal(),
              },
            ],
          });
        },
      },
    ],
    [showActions, closeModal, deleteMutateAsync, isPending, openModal, t],
  );

  return (
    <Table withPagination handlePage={setPage} page={page} totalPages={data?.totalPages || 1}>
      <TableHeader>
        <TableRow>
          <TableHead>{t('DATE')}</TableHead>
          {electricityType === IElectricityType.SINGLE && <TableHead>{t('ELECTRICITY')}</TableHead>}
          {electricityType === IElectricityType.DOUBLE && (
            <>
              <TableHead>{t('ELECTRICITY_DAY')}</TableHead>
              <TableHead>{t('ELECTRICITY_NIGHT')}</TableHead>
            </>
          )}
          <TableHead>{t('GAS')}</TableHead>
          <TableHead>{t('WATER')}</TableHead>
          {showActions && <TableHead className='w-1' />}
        </TableRow>
      </TableHeader>
      <TableBody isLoading={isLoading}>
        {(data?.data ?? []).map(month => (
          <TableRow key={month.id}>
            <TableCell>
              {formatDate({
                date: month.date,
              })}
            </TableCell>
            {isSingleElectricity(electricityType) && (
              <TableCell>{formatEnergy(month?.meters?.electricity?.single)}</TableCell>
            )}
            {isDoubleElectricity(electricityType) && (
              <>
                <TableCell>{formatEnergy(month?.meters?.electricity?.day)}</TableCell>
                <TableCell>{formatEnergy(month?.meters?.electricity?.night)}</TableCell>
              </>
            )}

            <TableCell>{formatVolume(month?.meters?.gas)}</TableCell>
            <TableCell>{formatVolume(month?.meters?.water)}</TableCell>
            {showActions && (
              <TableCell>
                <DropdownActions actions={actions(month)} />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReadingTable;
