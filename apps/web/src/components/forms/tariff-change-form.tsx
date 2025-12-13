'use client';

import { useRouter } from 'next/navigation';

import { useUpdateTariff } from '@/hooks/use-property';
import { useModalState } from '@/stores/use-modal-state';
import { zodResolver } from '@hookform/resolvers/zod';
import { IElectricityType, IProperty } from '@workspace/types';
import { getElectricityMeterLabel, type UpdatePropertySchema, updatePropertySchema, } from '@workspace/utils';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@workspace/ui/components/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from '@workspace/ui/components/form';
import NumberInput from '@workspace/ui/components/number-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@workspace/ui/components/select';
import { cn } from '@workspace/ui/lib/utils';

interface TariffChangeFormProps {
  property: IProperty;
}

export function ChangeTariffForm({ property }: TariffChangeFormProps) {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useUpdateTariff();
  const router = useRouter();
  const closeModal = useModalState(s => s.closeModal);

  const defaultTariffs =
    property.currentTariff?.tariffs || property.lastReading?.tariff?.tariffs;
  const defaultFixed =
    property.currentTariff?.fixedCosts ||
    property.lastReading?.tariff?.fixedCosts;

  const form = useForm<UpdatePropertySchema>({
    resolver: zodResolver(updatePropertySchema),
    defaultValues: {
      electricityType: property.electricityType || IElectricityType.SINGLE,
      tariffs: {
        electricity: {
          single: defaultTariffs?.electricity?.single ?? 0,
          day: defaultTariffs?.electricity?.day ?? 0,
          night: defaultTariffs?.electricity?.night ?? 0,
        },
        water: defaultTariffs?.water ?? 0,
        gas: defaultTariffs?.gas ?? 0,
      },
      fixedCosts: {
        internet: defaultFixed?.internet ?? 0,
        maintenance: defaultFixed?.maintenance ?? 0,
        gas_delivery: defaultFixed?.gas_delivery ?? 0,
      },
    },
  });

  const electricityType = form.watch('electricityType');

  const onSubmit = async (data: UpdatePropertySchema) => {
    await mutateAsync({ id: property.id, data });
    closeModal();
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('grid gap-2')}>
        {/* Тип лічильника (Кореневий рівень) */}
        <FormField
          control={form.control}
          name='electricityType'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('ELECTRICITY_SELECT')}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={true}
              >
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

        {/* Умовний рендерінг полів залежно від electricityType */}
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

        {electricityType === IElectricityType.DOUBLE && (
          <div className='grid grid-cols-2 gap-2'>
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
            />
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
          </div>
        )}

        {/* Газ та Вода */}
        <div className='grid grid-cols-2 gap-2'>
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
                    onValueChange={({ floatValue }) =>
                      field.onChange(floatValue)
                    }
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
                    onValueChange={({ floatValue }) =>
                      field.onChange(floatValue)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <hr className='my-3' />

        {/* Фіксовані витрати */}
        {[
          { name: 'fixedCosts.internet', label: t('INTERNET') },
          { name: 'fixedCosts.maintenance', label: t('MAINTENANCE') },
          { name: 'fixedCosts.gas_delivery', label: t('GAS_DELIVERY') },
        ].map(el => {
          // TypeScript Path Trick: ми гарантуємо, що це валідний шлях
          const fieldName = el.name as any;

          return (
            <FormField
              key={el.name}
              control={form.control}
              name={fieldName}
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
