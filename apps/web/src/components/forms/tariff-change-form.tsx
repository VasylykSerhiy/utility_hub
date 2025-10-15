'use client';

import { useRouter } from 'next/navigation';

import { useUpdateTariff } from '@/hooks/use-property';
import { useModalState } from '@/stores/use-modal-state';
import { zodResolver } from '@hookform/resolvers/zod';
import { ElectricityMeterType, IProperty } from '@workspace/types';
import {
  PropertySchema,
  UpdatePropertySchema,
  updatePropertySchema,
} from '@workspace/utils';
import { getElectricityMeterLabel } from '@workspace/utils';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@workspace/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import NumberInput from '@workspace/ui/components/number-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { cn } from '@workspace/ui/lib/utils';

interface TariffChangeFormProps {
  property: IProperty;
}

export function ChangeTariffForm({ property }: TariffChangeFormProps) {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useUpdateTariff();
  const router = useRouter();
  const closeModal = useModalState(s => s.closeModal);

  const form = useForm<UpdatePropertySchema>({
    resolver: zodResolver(updatePropertySchema),
    defaultValues: {
      tariffs: property?.lastMonth?.tariff?.tariffs,
      fixedCosts: property?.lastMonth?.tariff?.fixedCosts,
    },
  });

  const electricityType = property?.electricityType;

  const onSubmit = async (data: UpdatePropertySchema) => {
    await mutateAsync({ id: property.id, data });
    closeModal();
    router.push('/property');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('grid gap-2')}>
        <FormField
          control={form.control}
          name='tariffs.electricity.type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('ELECTRICITY_SELECT')}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled
              >
                <FormControl>
                  <SelectTrigger className='w-full capitalize'>
                    <SelectValue placeholder={t('ELECTRICITY_SELECT')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ElectricityMeterType).map(el => (
                    <SelectItem value={el} key={el} className='capitalize'>
                      {getElectricityMeterLabel(el)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {electricityType === ElectricityMeterType.SINGLE && (
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
                    onValueChange={({ floatValue }) =>
                      field.onChange(floatValue)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {electricityType === ElectricityMeterType.DOUBLE && (
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
                      onValueChange={({ floatValue }) =>
                        field.onChange(floatValue)
                      }
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
                      onValueChange={({ floatValue }) =>
                        field.onChange(floatValue)
                      }
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
          { name: 'fixedCosts.internet', label: t('INTERNET') },
          {
            name: 'fixedCosts.maintenance',
            label: t('MAINTENANCE'),
          },
          {
            name: 'fixedCosts.gas_delivery',
            label: t('GAS_DELIVERY'),
          },
        ].map(el => {
          const key = el.name as keyof PropertySchema['fixedCosts'];
          return (
            <FormField
              key={el.name}
              control={form.control}
              name={key}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(el.label)}</FormLabel>
                  <FormControl>
                    <NumberInput
                      {...field}
                      onChange={undefined}
                      onValueChange={({ floatValue }) =>
                        field.onChange(floatValue)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        <Button className='mt-2' type='submit' isLoading={isPending}>
          {t('BUTTONS.CREATE')}
        </Button>
      </form>
    </Form>
  );
}
