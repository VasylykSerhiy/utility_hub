'use client';

import React from 'react';

import { getProperty } from '@/hooks/use-property';
import PropertyLastMonthDetail from '@/modules/property/property-last-month-detail';
import { Emodal, useModalState } from '@/stores/use-modal-state';
import { ElectricityMeterType } from '@workspace/types';
import { getElectricityMeterLabel } from '@workspace/utils';
import { useTranslation } from 'react-i18next';

import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';

const PropertyHeader = ({ id }: { id: string }) => {
  const { data, isLoading } = getProperty(id);
  const openModal = useModalState(s => s.openModal);

  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader className='flex items-center justify-between'>
        <CardTitle className='text-lg font-semibold'>
          {isLoading ? <Skeleton className='h-7 w-20' /> : data?.name}
        </CardTitle>
      </CardHeader>
      <div className='grid grid-cols-1 md:grid-cols-2'>
        <div className='relative'>
          <PropertyLastMonthDetail
            lastMonth={data?.lastMonth!}
            isLoading={isLoading}
          />

          <div className='bg-border absolute right-0 top-0 h-full w-[1px] max-md:hidden' />
        </div>

        <CardContent className='flex flex-col justify-between'>
          <div>
            <p className='text-lg font-medium'>{t('TARIFF')}:</p>
            <div className='mb-2'>
              {isLoading ? (
                <Skeleton className='h-5 w-20' />
              ) : (
                getElectricityMeterLabel(data?.electricityType!)
              )}
            </div>
            <div>
              {[
                ...(data?.electricityType === ElectricityMeterType.SINGLE
                  ? [
                      {
                        label: t('ELECTRICITY'),
                        value:
                          data?.lastMonth?.tariff.tariffs?.electricity.single,
                      },
                    ]
                  : [
                      {
                        label: t('ELECTRICITY_DAY'),
                        value: data?.lastMonth?.tariff.tariffs?.electricity.day,
                      },
                      {
                        label: t('ELECTRICITY_NIGHT'),
                        value:
                          data?.lastMonth?.tariff.tariffs?.electricity.night,
                      },
                    ]),
                {
                  label: t('WATER'),
                  value: data?.lastMonth?.tariff.tariffs?.water,
                },
                {
                  label: t('GAS'),
                  value: data?.lastMonth?.tariff.tariffs?.gas,
                },
              ].map((item, index) => (
                <div key={index} className='mt-2 flex gap-2'>
                  <span>{item.label}:</span>
                  <span>{item?.value ?? '-'} </span>
                </div>
              ))}
            </div>
          </div>
          <div className='mt-4 grid grid-cols-1 gap-2 md:grid-cols-2'>
            <Button className='w-full'>{t('BUTTONS.CHANGE_TARIFF')}</Button>
            <Button
              onClick={() => openModal(Emodal.CrateMeter, { id })}
              className='w-full'
            >
              {t('BUTTONS.ADD_METER')}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default PropertyHeader;
