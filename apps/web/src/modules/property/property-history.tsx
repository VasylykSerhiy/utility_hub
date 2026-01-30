'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import Tabs from '@workspace/ui/components/tabs';
import { useTranslation } from 'react-i18next';
import ReadingTable from '@/components/tables/reading-table';
import TariffsTable from '@/components/tables/tariffs-table';
import { useTabs } from '@/hooks/use-tabs';

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
      content: <TariffsTable />,
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
