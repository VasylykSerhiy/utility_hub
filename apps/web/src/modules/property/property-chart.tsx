'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  type ChartConfig,
  ChartContainer,
} from '@workspace/ui/components/chart';
import { numericFormatter } from '@workspace/utils';
import { format } from 'date-fns';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CartesianGrid, Line, LineChart, Tooltip, YAxis } from 'recharts';
import { getPropertyMetrics } from '@/hooks/use-property';
import PropertyChartTooltip from '@/modules/property/property-chart-tooltip';

const PropertyChart = () => {
  const { t } = useTranslation();
  const { slug } = useParams();

  const { data, isLoading } = getPropertyMetrics(slug as string);

  const chartData = useMemo(() => {
    if (!data) return [];

    return data.map(item => {
      const tariff = item.tariff.tariffs;

      return {
        date: item.date,
        electricityType: item.electricityType,
        label: format(new Date(item.date), 'MMM dd'),
        difference: item.difference,
        cost: {
          ...item.tariff.fixedCosts,
          gas: Number(item.difference?.gas * tariff.gas) ?? 0,
          water: Number(item.difference?.water * tariff.water) ?? 0,
          electricity: {
            ...(item.difference.electricity.single && {
              type: 'single',
              single:
                Number(
                  item.difference.electricity.single *
                    (tariff.electricity.single ?? 0),
                ) ?? 0,
            }),
            ...(item.difference.electricity.day &&
              item.difference.electricity.night && {
                type: 'double',
                day:
                  Number(
                    item.difference.electricity.day *
                      (tariff.electricity.day ?? 0),
                  ) ?? 0,
                night:
                  Number(
                    item.difference.electricity.night *
                      (tariff.electricity.day ?? 0),
                  ) ?? 0,
              }),
          },
          total: item.total,
        },
      };
    });
  }, [data]);

  const electricityType = chartData?.[0]?.electricityType;

  const chartConfig = {
    'difference.water': {
      label: t('WATER'),
      color: 'var(--water)',
    },
    'difference.gas': {
      label: t('GAS'),
      color: 'var(--gas)',
    },
    'difference.electricity.single': {
      label: t('ELECTRICITY'),
      color: 'var(--electricity-day)',
    },
    'difference.electricity.day': {
      label: t('ELECTRICITY_DAY'),
      color: 'var(--electricity-day)',
    },
    'difference.electricity.night': {
      label: t('ELECTRICITY_NIGHT'),
      color: 'var(--electricity-night)',
    },
  } satisfies ChartConfig;

  if (isLoading) {
    return;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('CHART')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='md:h-100 h-60 w-full'>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray='0' vertical={false} />
            <YAxis
              tickFormatter={v => numericFormatter(v)}
              className='text-xs font-normal'
              strokeWidth={0}
              offset={50}
              width={25}
            />
            <Line
              type='monotone'
              dataKey='difference.water'
              strokeWidth={2}
              dot={false}
              isAnimationActive
              stroke='var(--water)'
            />
            <Line
              type='monotone'
              dataKey='difference.gas'
              strokeWidth={2}
              dot={false}
              stroke='var(--gas)'
            />
            {electricityType === 'single' && (
              <Line
                type='monotone'
                dataKey='difference.electricity.single'
                strokeWidth={2}
                dot={false}
                stroke='var(--electricity-day)'
              />
            )}
            {electricityType === 'double' ? (
              <Line
                type='monotone'
                dataKey='difference.electricity.day'
                strokeWidth={2}
                dot={false}
                stroke='var(--electricity-day)'
              />
            ) : null}
            {electricityType === 'double' ? (
              <Line
                type='monotone'
                dataKey='difference.electricity.night'
                strokeWidth={2}
                dot={false}
                stroke='var(--electricity-night)'
              />
            ) : null}
            <Tooltip content={<PropertyChartTooltip />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PropertyChart;
