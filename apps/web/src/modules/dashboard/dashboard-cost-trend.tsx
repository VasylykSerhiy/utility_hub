import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@workspace/ui/components/chart';
import {
  formatCurrencySymbol,
  formatDate,
  localeDateMap,
} from '@workspace/utils';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { useGetDashboardAnalytics } from '@/hooks/use-dashboard';
import { useLanguage } from '@/providers/language-provider';

const DashboardConstTrend = () => {
  const { data } = useGetDashboardAnalytics();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const chartConfig = {
    total: {
      label: t('TOTAL'),
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  return (
    <Card className='size-full'>
      <CardHeader>
        <CardTitle>{t('DASHBOARD.CARD.TITLE.COST_TREND')}</CardTitle>
      </CardHeader>
      <CardContent className='flex-1'>
        <ChartContainer
          config={chartConfig}
          className='h-(--height-chart) w-full'
        >
          <BarChart accessibilityLayer data={data?.sixMonthTrend}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={v =>
                formatDate({
                  date: v,
                  locale: localeDateMap[language],
                  customFormat: 'MMMM',
                })
              }
            />
            <YAxis
              dataKey='total'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => formatCurrencySymbol(value)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey='total' fill='var(--primary)' radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DashboardConstTrend;
