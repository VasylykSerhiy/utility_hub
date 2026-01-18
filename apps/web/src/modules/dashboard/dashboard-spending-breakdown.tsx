'use client';

import { useMemo } from 'react';

import { useGetDashboardAnalytics } from '@/hooks/use-dashboard';
import { useTranslation } from 'react-i18next';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@workspace/ui/components/chart';

const DashboardSpendingBreakdown = () => {
  const { data } = useGetDashboardAnalytics();
  const { t } = useTranslation();

  const chartData = useMemo(() => {
    const breakdown = data?.spendingBreakdown;
    if (!breakdown) return [];

    return [
      {
        name: 'gas',
        value: Number(breakdown.gas) || 0,
        fill: 'var(--gas)',
        displayLabel: t('GAS'),
      },
      {
        name: 'electricity',
        value: Number(breakdown.electricity) || 0,
        fill: 'var(--electricity-day)',
        displayLabel: t('ELECTRICITY'),
      },
      {
        name: 'water',
        value: Number(breakdown.water) || 0,
        fill: 'var(--water)',
        displayLabel: t('WATER'),
      },
      {
        name: 'fixed_costs',
        value: Number(breakdown.fixed) || 0,
        fill: 'var(--electricity-night)',
        displayLabel: t('FIXED'),
      },
    ].filter(item => item.value > 0);
  }, [data, t]);

  const chartConfig = useMemo(() => {
    return chartData.reduce((config, item) => {
      config[item.name] = {
        label: item.displayLabel,
        color: item.fill,
      };
      return config;
    }, {} as ChartConfig);
  }, [chartData]);

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('DASHBOARD.CARD.TITLE.SPENDING_BREAKDOWN')}</CardTitle>
      </CardHeader>
      <CardContent className='flex-1'>
        <ChartContainer
          config={chartConfig}
          className={'h-(--height-chart) w-full'}
        >
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey='value'
                nameKey='name'
                innerRadius={60}
                outerRadius={85}
                paddingAngle={2}
                label={({ name, percent, x, y, cx }) => {
                  const labelName = chartConfig[name]?.label || name;
                  return (
                    <text
                      x={x}
                      y={y}
                      fill='currentColor'
                      fontSize={12}
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline='central'
                      className='font-medium'
                    >
                      {`${labelName} ${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    className='transition-opacity hover:opacity-80'
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DashboardSpendingBreakdown;
