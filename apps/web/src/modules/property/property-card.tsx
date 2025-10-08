'use client';

import { Fragment } from 'react';

import { IDifference, IPropertyWithLastMonth } from '@workspace/types';

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
}: IPropertyWithLastMonth) {
  const keys: (keyof IDifference)[] = [
    'electricityDay',
    'electricityNight',
    'water',
    'gas',
  ];

  const total =
    keys.reduce(
      (sum, key) =>
        sum + (lastMonth?.difference?.[key] ?? 0) * (tariffs?.[key] ?? 0),
      0,
    ) +
    (fixedCosts?.internet ?? 0) +
    (fixedCosts?.maintenance ?? 0);

  return (
    <Card className='border border-gray-700 shadow-lg transition-shadow duration-300 hover:shadow-xl'>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>{name}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-2'>
        <div>
          <div className='flex justify-between gap-1'>
            <span className='font-medium'>Показник</span>
            <span className='font-medium'>Вартість</span>
          </div>
          <div className='ml-2 grid grid-cols-[auto_1fr] gap-1'>
            {[
              { label: 'День', key: 'electricityDay' },
              { label: 'Ніч', key: 'electricityNight' },
              { label: 'Вода', key: 'water' },
              { label: 'Газ', key: 'gas' },
            ].map(item => {
              const key = item.key as keyof IDifference;
              return (
                <Fragment key={key}>
                  <p className='flex justify-between gap-x-7'>
                    {item.label}:{' '}
                    <span>{lastMonth?.difference?.[key] ?? 0}</span>
                  </p>
                  <span className='text-right'>
                    {(lastMonth?.difference?.[key] ?? 0) * tariffs?.[key]}
                  </span>
                </Fragment>
              );
            })}
          </div>
        </div>
        <hr />
        <div>
          <span className='font-medium'>Фіксовані витрати:</span>
          <div className='ml-2'>
            {[
              { label: 'Інтернет', value: fixedCosts.internet },
              { label: 'Обслуговування', value: fixedCosts?.maintenance },
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
          <span className='font-medium'>Сума:</span>
          <span className='font-medium'>{total}</span>
        </div>
      </CardContent>
      <CardFooter>
        <div className='grid w-full grid-cols-2 gap-2'>
          <Button className='w-full'>Детальніше</Button>
          <Button className='w-full'>Додати місяць</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
