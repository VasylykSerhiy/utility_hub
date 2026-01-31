'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { IElectricityType, type IMonth, type IProperty } from '@workspace/types';
import { Button } from '@workspace/ui/components/button';
import { DatePicker } from '@workspace/ui/components/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import NumberInput from '@workspace/ui/components/number-input';
import { Switch } from '@workspace/ui/components/switch';
import { cn } from '@workspace/ui/lib/utils';
import { type MonthSchema, monthSchemaClient } from '@workspace/utils';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useCreateMeter, useUpdateMeter } from '@/hooks/use-property';
import { useLanguage } from '@/providers/language-provider';
import { useModalStore } from '@/stores/use-modal-state';

interface MeterCreateFormProps {
  property: IProperty;
  meter?: IMonth;
}

export function MeterCreateForm({ property, meter }: MeterCreateFormProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { mutateAsync } = useCreateMeter();
  const { mutateAsync: updateMeterAsync } = useUpdateMeter();
  const closeModal = useModalStore(s => s.closeModal);

  const electricityType = meter?.electricityType ?? property.electricityType;
  const form = useForm<MonthSchema>({
    resolver: zodResolver(monthSchemaClient),
    defaultValues: {
      date: meter?.date ? new Date(meter?.date) : new Date(),
      meters: {
        electricity: {
          type: electricityType,
          ...(electricityType === IElectricityType.SINGLE
            ? {
                single: meter?.meters.electricity.single ?? undefined,
              }
            : {
                day: meter?.meters.electricity.day ?? undefined,
                night: meter?.meters.electricity.night ?? undefined,
              }),
        },
        gas: meter?.meters.gas ?? undefined,
        water: meter?.meters.water ?? undefined,
      },
      replacement: undefined,
    },
  });

  const isReplacement = form.watch('replacement') != null;

  const onSubmit = async (data: MonthSchema) => {
    const payload: MonthSchema = {
      ...data,
      replacement: isReplacement ? data.replacement : undefined,
    };
    if (meter?.id) {
      await updateMeterAsync({
        id: property.id,
        meterId: meter.id,
        data: payload,
      });
    } else {
      await mutateAsync({
        id: property.id,
        data: payload,
      });
    }
    closeModal();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('grid gap-2 overflow-auto ')}>
        <FormField
          control={form.control}
          name='date'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('DATE')}</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  setDate={date => {
                    field.onChange(date);
                  }}
                  language={language}
                  placeholder={t('FORM.PLACEHOLDER.DATE')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <hr className='my-3' />
        {electricityType === IElectricityType.SINGLE && (
          <FormField
            control={form.control}
            name='meters.electricity.single'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('ELECTRICITY')}</FormLabel>
                <FormControl>
                  <NumberInput
                    {...field}
                    onChange={undefined}
                    onValueChange={({ floatValue }) => field.onChange(floatValue)}
                    placeholder={`${property?.lastReading?.meters?.electricity?.single ?? 0}`}
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
              name='meters.electricity.day'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('ELECTRICITY_DAY')}</FormLabel>
                  <FormControl>
                    <NumberInput
                      {...field}
                      onChange={undefined}
                      onValueChange={({ floatValue }) => field.onChange(floatValue)}
                      placeholder={`${property?.lastReading?.meters?.electricity?.day ?? 0}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{' '}
            <FormField
              control={form.control}
              name='meters.electricity.night'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('ELECTRICITY_NIGHT')}</FormLabel>
                  <FormControl>
                    <NumberInput
                      {...field}
                      onChange={undefined}
                      onValueChange={({ floatValue }) => field.onChange(floatValue)}
                      placeholder={`${property?.lastReading?.meters?.electricity?.night ?? 0}`}
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
          name='meters.gas'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('GAS')}</FormLabel>
              <FormControl>
                <NumberInput
                  {...field}
                  onChange={undefined}
                  onValueChange={({ floatValue }) => field.onChange(floatValue)}
                  placeholder={`${property?.lastReading?.meters?.gas ?? 0}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='meters.water'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('WATER')}</FormLabel>
              <FormControl>
                <NumberInput
                  {...field}
                  onChange={undefined}
                  onValueChange={({ floatValue }) => field.onChange(floatValue)}
                  placeholder={`${property?.lastReading?.meters?.water ?? 0}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <hr className='my-3' />
        {/* UA: Секція заміни лічильника (baseline / old final). EN: Meter replacement section. */}
        <FormField
          control={form.control}
          name='replacement'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base'>{t('METER_REPLACEMENT')}</FormLabel>
                <p className='text-muted-foreground text-sm'>{t('METER_REPLACEMENT_HINT')}</p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value != null}
                  onCheckedChange={checked => {
                    field.onChange(checked ? { electricity: {}, water: {}, gas: {} } : undefined);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {isReplacement && (
          <>
            {electricityType === IElectricityType.SINGLE && (
              <>
                <FormField
                  control={form.control}
                  name='replacement.electricity.baselineSingle'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('ELECTRICITY')} — {t('METER_REPLACEMENT_BASELINE')}
                      </FormLabel>
                      <FormControl>
                        <NumberInput
                          {...field}
                          onChange={undefined}
                          onValueChange={({ floatValue }) =>
                            field.onChange(floatValue ?? undefined)
                          }
                          placeholder='0'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='replacement.electricity.oldFinalSingle'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('ELECTRICITY')} — {t('METER_REPLACEMENT_OLD_FINAL')}
                      </FormLabel>
                      <FormControl>
                        <NumberInput
                          {...field}
                          onChange={undefined}
                          onValueChange={({ floatValue }) =>
                            field.onChange(floatValue ?? undefined)
                          }
                          placeholder='—'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {electricityType === IElectricityType.DOUBLE && (
              <>
                <FormField
                  control={form.control}
                  name='replacement.electricity.baselineDay'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('ELECTRICITY_DAY')} — {t('METER_REPLACEMENT_BASELINE')}
                      </FormLabel>
                      <FormControl>
                        <NumberInput
                          {...field}
                          onChange={undefined}
                          onValueChange={({ floatValue }) =>
                            field.onChange(floatValue ?? undefined)
                          }
                          placeholder='0'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='replacement.electricity.baselineNight'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('ELECTRICITY_NIGHT')} — {t('METER_REPLACEMENT_BASELINE')}
                      </FormLabel>
                      <FormControl>
                        <NumberInput
                          {...field}
                          onChange={undefined}
                          onValueChange={({ floatValue }) =>
                            field.onChange(floatValue ?? undefined)
                          }
                          placeholder='0'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='replacement.electricity.oldFinalDay'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('ELECTRICITY_DAY')} — {t('METER_REPLACEMENT_OLD_FINAL')}
                      </FormLabel>
                      <FormControl>
                        <NumberInput
                          {...field}
                          onChange={undefined}
                          onValueChange={({ floatValue }) =>
                            field.onChange(floatValue ?? undefined)
                          }
                          placeholder='—'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='replacement.electricity.oldFinalNight'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('ELECTRICITY_NIGHT')} — {t('METER_REPLACEMENT_OLD_FINAL')}
                      </FormLabel>
                      <FormControl>
                        <NumberInput
                          {...field}
                          onChange={undefined}
                          onValueChange={({ floatValue }) =>
                            field.onChange(floatValue ?? undefined)
                          }
                          placeholder='—'
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
              name='replacement.water.baseline'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('WATER')} — {t('METER_REPLACEMENT_BASELINE')}
                  </FormLabel>
                  <FormControl>
                    <NumberInput
                      {...field}
                      onChange={undefined}
                      onValueChange={({ floatValue }) => field.onChange(floatValue ?? undefined)}
                      placeholder='0'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='replacement.water.oldFinal'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('WATER')} — {t('METER_REPLACEMENT_OLD_FINAL')}
                  </FormLabel>
                  <FormControl>
                    <NumberInput
                      {...field}
                      onChange={undefined}
                      onValueChange={({ floatValue }) => field.onChange(floatValue ?? undefined)}
                      placeholder='—'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='replacement.gas.baseline'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('GAS')} — {t('METER_REPLACEMENT_BASELINE')}
                  </FormLabel>
                  <FormControl>
                    <NumberInput
                      {...field}
                      onChange={undefined}
                      onValueChange={({ floatValue }) => field.onChange(floatValue ?? undefined)}
                      placeholder='0'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='replacement.gas.oldFinal'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('GAS')} — {t('METER_REPLACEMENT_OLD_FINAL')}
                  </FormLabel>
                  <FormControl>
                    <NumberInput
                      {...field}
                      onChange={undefined}
                      onValueChange={({ floatValue }) => field.onChange(floatValue ?? undefined)}
                      placeholder='—'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <hr className='my-3' />
        <Button className='mt-2' type='submit'>
          {t(meter?.id ? 'BUTTONS.EDIT' : 'BUTTONS.CREATE')}
        </Button>
      </form>
    </Form>
  );
}
