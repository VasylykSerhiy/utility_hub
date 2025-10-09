'use client';

import { HTMLAttributes } from 'react';

import { useRouter } from 'next/navigation';

import { useProperty } from '@/hooks/use-property';
import { zodResolver } from '@hookform/resolvers/zod';
import { ElectricityMeterType } from '@workspace/types';
import {
  CreatePropertySchema,
  PropertySchema,
  UpdatePropertySchema,
  createPropertySchema,
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

interface PropertyCreateForm extends HTMLAttributes<HTMLFormElement> {
  type?: 'create' | 'edit';
}

export function PropertyCreateForm({
  className,
  type = 'create',
  ...props
}: PropertyCreateForm) {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useProperty(type);
  const router = useRouter();

  const schema =
    type === 'create' ? createPropertySchema : updatePropertySchema;
  type FormValues = CreatePropertySchema | UpdatePropertySchema;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
    },
  });

  const electricityType = form.watch('tariffs.electricity.type');

  const onSubmit = async (data: FormValues) => {
    console.log(`data`, data);
    await mutateAsync(data);
    router.push('/property');
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
                <Input
                  placeholder={t('FORM.PROPERTY.PLACEHOLDER')}
                  {...field}
                />
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
