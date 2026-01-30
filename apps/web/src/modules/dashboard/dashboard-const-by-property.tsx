import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@workspace/ui/components/chart';
import { formatCurrencySymbol } from '@workspace/utils';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { useGetDashboardAnalytics } from '@/hooks/use-dashboard';

const DashboardConstByProperty = () => {
  const { data } = useGetDashboardAnalytics();
  const { t } = useTranslation();

  const chartConfig = {
    total: {
      label: t('TOTAL'),
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('DASHBOARD.CARD.TITLE.COST_BY_PROPERTY')}</CardTitle>
      </CardHeader>
      <CardContent className='flex-1'>
        <ChartContainer config={chartConfig} className='h-(--height-chart) w-full'>
          <BarChart accessibilityLayer data={data?.costByProperty}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='name' tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis
              dataKey='total'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => formatCurrencySymbol(value)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey='total' fill='var(--primary)' radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DashboardConstByProperty;
