'use client';

import type { HTMLAttributes } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { IElectricityType } from '@workspace/types';
import { Button } from '@workspace/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import NumberInput from '@workspace/ui/components/number-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { cn } from '@workspace/ui/lib/utils';
import {
  type CreatePropertySchema,
  createPropertySchema,
  getElectricityMeterLabel,
} from '@workspace/utils';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Routes } from '@/constants/router';
import { useCreateProperty } from '@/hooks/use-property';
import { getApiErrorMessage } from '@/lib/axios';

interface PropertyCreateForm extends HTMLAttributes<HTMLFormElement> {}

export function PropertyCreateForm({ className, ...props }: PropertyCreateForm) {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useCreateProperty();
  const router = useRouter();

  const form = useForm<CreatePropertySchema>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: {
      name: '',
      tariffs: {
        electricity: { type: IElectricityType.SINGLE, single: 0 },
        water: 0,
        gas: 0,
      },
      fixedCosts: {
        internet: 0,
        maintenance: 0,
        gas_delivery: 0,
      },
    },
  });

  const electricityType = form.watch('tariffs.electricity.type');

  const onSubmit = async (data: CreatePropertySchema) => {
    try {
      await mutateAsync(data);
      router.push(Routes.PROPERTY);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-2', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('FORM.PROPERTY.NAME')}</FormLabel>
              <FormControl>
                <Input placeholder={t('FORM.PROPERTY.PLACEHOLDER')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <hr className='my-3' />
        <FormField
          control={form.control}
          name='tariffs.electricity.type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('ELECTRICITY_SELECT')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className='w-full capitalize'>
                    <SelectValue placeholder={t('ELECTRICITY_SELECT')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(IElectricityType).map(el => (
                    <SelectItem value={el} key={el} className='capitalize'>
                      {getElectricityMeterLabel(el)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {electricityType === IElectricityType.SINGLE && (
          <FormField
            control={form.control}
            name='tariffs.electricity.single'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('ELECTRICITY')}</FormLabel>
                <FormControl>
                  <NumberInput
                    {...field}
                    onChange={undefined}
                    onValueChange={({ floatValue }) => field.onChange(floatValue)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {electricityType === IElectricityType.DOUBLE && (
          <>
            <FormField
              control={form.control}
              name='tariffs.electricity.day'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('ELECTRICITY_DAY')}</FormLabel>
                  <FormControl>
                    <NumberInput
                      {...field}
                      onChange={undefined}
                      onValueChange={({ floatValue }) => field.onChange(floatValue)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{' '}
            <FormField
              control={form.control}
              name='tariffs.electricity.night'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('ELECTRICITY_NIGHT')}</FormLabel>
                  <FormControl>
                    <NumberInput
                      {...field}
                      onChange={undefined}
                      onValueChange={({ floatValue }) => field.onChange(floatValue)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <FormField
          control={form.control}
          name='tariffs.gas'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('GAS')}</FormLabel>
              <FormControl>
                <NumberInput
                  {...field}
                  onChange={undefined}
                  onValueChange={({ floatValue }) => field.onChange(floatValue)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='tariffs.water'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('WATER')}</FormLabel>
              <FormControl>
                <NumberInput
                  {...field}
                  onChange={undefined}
                  onValueChange={({ floatValue }) => field.onChange(floatValue)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <hr className='my-3' />

        {[
          { name: 'fixedCosts.internet' as const, label: 'INTERNET' },
          { name: 'fixedCosts.maintenance' as const, label: 'MAINTENANCE' },
          { name: 'fixedCosts.gas_delivery' as const, label: 'GAS_DELIVERY' },
        ].map(el => (
          <FormField
            key={el.name}
            control={form.control}
            name={el.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t(el.label)}</FormLabel>
                  <FormControl>
                    <NumberInput
                      {...field}
                      onChange={undefined}
                      onValueChange={({ floatValue }) => field.onChange(floatValue)}
                    />
                  </FormControl>
                  <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button className='mt-2' type='submit' isLoading={isPending}>
          {t('BUTTONS.CREATE')}
        </Button>
      </form>
    </Form>
  );
}
