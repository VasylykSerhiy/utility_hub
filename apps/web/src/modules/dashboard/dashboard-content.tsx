'use client';

import React, { useMemo } from 'react';

import { useGetDashboardAnalytics } from '@/hooks/use-dashboard';
import DashboardConstByProperty from '@/modules/dashboard/dashboard-const-by-property';
import DashboardConstTrend from '@/modules/dashboard/dashboard-cost-trend';
import DashboardSpendingBreakdown from '@/modules/dashboard/dashboard-spending-breakdown';
import { useLanguage } from '@/providers/language-provider';
import {
  formatCurrencySymbol,
  formatDate,
  localeDateMap,
} from '@workspace/utils';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { cn } from '@workspace/ui/lib/utils';

const DashboardContent = () => {
  const { data } = useGetDashboardAnalytics();
  const { language } = useLanguage();
  const { t } = useTranslation();

  const cards = useMemo(
    () => [
      {
        title: `${t('DASHBOARD.CARD.TITLE.TOTAL_COSTS')}  (${formatDate({
          date: data?.currentMonthName,
          customFormat: 'MMM yyyy',
          locale: localeDateMap[language],
        })})`,
        content: formatCurrencySymbol(data?.totalSpentCurrentMonth),
      },
      {
        title: t('DASHBOARD.CARD.TITLE.PENDING_READINGS'),
        content: t('DASHBOARD.CARD.VALUE.PENDING_READINGS', {
          count: data?.pendingReadingsCount || 0,
        }),
        isWarning: data?.pendingReadingsCount! > 0,
      },
      {
        title: t('DASHBOARD.CARD.TITLE.ACTIVE_PROPERTIES'),
        content: data?.activeProperties,
      },
    ],
    [
      data?.totalSpentCurrentMonth,
      data?.pendingReadingsCount,
      data?.activeProperties,
      t,
      language,
    ],
  );

  return (
    <div className='@container flex flex-col gap-4'>
      <div className='@max-[750px]:grid-cols-1 grid max-w-[1100px] grid-cols-3 gap-x-4 gap-y-2'>
        {cards.map(card => (
          <Card key={card.title} className='justify-between'>
            <CardHeader>
              <CardTitle className='text-lg font-normal'>
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent
              className={cn('text-3xl font-bold', {
                'text-warning': card.isWarning,
              })}
            >
              {card.content}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='@[1921px]:grid-cols-4 @[800px]:grid-cols-2 grid grid-cols-1 gap-4'>
        <DashboardSpendingBreakdown />
        <DashboardConstByProperty />
        <div className='@[800px]:col-span-2 col-span-1'>
          <DashboardConstTrend />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
