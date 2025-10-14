'use client';

import React from 'react';

import ReadingTable from '@/components/tables/reading-table';
import { useTabs } from '@/hooks/use-tabs';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import Tabs from '@workspace/ui/components/tabs';

const PropertyHistory = () => {
  const { t } = useTranslation();

  const tabs = [
    {
      label: t('READING'),
      id: 'reading',
      content: <ReadingTable />,
    },
    {
      label: t('TARIFFS'),
      id: 'tariffs',
      content: <div>TARIFFS</div>,
    },
  ];

  const { activeTabId, changeTab } = useTabs(tabs, {
    syncWithUrl: true,
    urlKey: 'history',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('HISTORY')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          tabs={tabs}
          activeTabId={activeTabId}
          onTabChangeAction={changeTab}
        />
      </CardContent>
    </Card>
  );
};

export default PropertyHistory;
