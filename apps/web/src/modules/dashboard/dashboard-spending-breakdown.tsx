'use client';

import { useMemo, useState } from 'react';

import { useGetDashboardAnalytics } from '@/hooks/use-dashboard';
import { useTranslation } from 'react-i18next';
import {
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
} from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@workspace/ui/components/chart';

/**
 * Extended interface for chart data including percentage.
 * Розширений інтерфейс даних графіка, що включає відсоток.
 */
interface SpendingDataItem {
  name: string;
  value: number;
  fill: string;
  displayLabel: string;
  percentage: string;
}

const DashboardSpendingBreakdown = () => {
  const { data } = useGetDashboardAnalytics();
  const { t } = useTranslation();

  // State for active (hovered) sector
  // Стан для активного (підсвіченого) сектора
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const chartData = useMemo<SpendingDataItem[]>(() => {
    const breakdown = data?.spendingBreakdown;
    if (!breakdown) return [];

    const rawItems = [
      {
        name: 'gas',
        value: Number(breakdown.gas) || 0,
        fill: 'var(--gas)',
        label: t('GAS'),
      },
      {
        name: 'electricity',
        value: Number(breakdown.electricity) || 0,
        fill: 'var(--electricity-day)',
        label: t('ELECTRICITY'),
      },
      {
        name: 'water',
        value: Number(breakdown.water) || 0,
        fill: 'var(--water)',
        label: t('WATER'),
      },
      {
        name: 'fixed_costs',
        value: Number(breakdown.fixed) || 0,
        fill: 'var(--electricity-night)',
        label: t('FIXED'),
      },
    ].filter(i => i.value > 0);

    const total = rawItems.reduce((acc, curr) => acc + curr.value, 0);

    return rawItems.map(item => ({
      ...item,
      displayLabel: item.label,
      percentage: ((item.value / total) * 100).toFixed(1) + '%',
    }));
  }, [data, t]);

  const totalSpending = useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.value, 0),
    [chartData],
  );

  const chartConfig = useMemo<ChartConfig>(() => {
    const config: ChartConfig = {};
    chartData.forEach(item => {
      config[item.name] = {
        label: `${item.displayLabel} (${item.percentage})`,
        color: item.fill,
      };
    });
    return config;
  }, [chartData]);

  if (chartData.length === 0) return null;

  return (
    <Card>
      <CardHeader className='items-center pb-0'>
        <CardTitle className='text-xl'>
          {t('DASHBOARD.CARD.TITLE.SPENDING_BREAKDOWN')}
        </CardTitle>
      </CardHeader>

      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='h-(--height-chart) mx-auto w-full'
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
                innerRadius={70}
                outerRadius={90}
                strokeWidth={2}
                paddingAngle={5}
                cornerRadius={8}
                activeIndex={activeIndex}
                activeShape={(props: PieSectorDataItem) => (
                  <Sector
                    {...props}
                    outerRadius={(props.outerRadius || 0) + 10}
                    innerRadius={(props.innerRadius || 0) - 2}
                  />
                )}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      const hoveredItem =
                        activeIndex !== undefined
                          ? chartData[activeIndex]
                          : null;

                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor='middle'
                          dominantBaseline='middle'
                        >
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 5}
                            className='fill-foreground text-2xl font-extrabold transition-all duration-300'
                          >
                            {hoveredItem
                              ? hoveredItem.percentage
                              : totalSpending.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className='fill-muted-foreground text-[10px] font-medium uppercase tracking-widest transition-all duration-300'
                          >
                            {hoveredItem
                              ? hoveredItem.displayLabel
                              : t('TOTAL')}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    className='stroke-background outline-none transition-opacity duration-300'
                    style={{
                      opacity:
                        activeIndex === undefined || activeIndex === index
                          ? 1
                          : 0.6,
                    }}
                  />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey='name' />}
                className='mt-4 flex-wrap justify-center gap-x-4 gap-y-2'
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DashboardSpendingBreakdown;
