import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  getPayloadConfigFromPayload,
  useChart,
} from '@workspace/ui/components/chart';
import { formatCurrencySymbol, formatDate } from '@workspace/utils';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import type * as RechartsPrimitive from 'recharts';

const PropertyChartTooltip = ({
  active,
  payload,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip>) => {
  const { t } = useTranslation();
  const { config } = useChart();

  if (!active || !payload || payload.length === 0) return null;
  const [item] = payload;
  const selectLabel = formatDate({ date: item?.payload?.date });
  const isSingle = Boolean(item?.payload?.cost?.electricity?.single > 0);

  return (
    <Card className='gap-0 shadow-2xl'>
      <CardHeader>
        <CardTitle className='text-lg'>{selectLabel}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <h2 className='text-base'>{t('CONSUMPTION')}</h2>
            <ul>
              {payload
                .filter(item => item.type !== 'none')
                .map(item => {
                  const key = `${item.name || item.dataKey || 'value'}`;
                  const itemConfig = getPayloadConfigFromPayload(
                    config,
                    item,
                    key,
                  );
                  const indicatorColor = item.payload.fill || item.color;

                  return (
                    <li key={key}>
                      <span
                        className='border-(--color-border) bg-(--color-bg) mr-2 inline-block h-2 w-2 rounded-full'
                        style={
                          {
                            '--color-bg': indicatorColor,
                            '--color-border': indicatorColor,
                          } as React.CSSProperties
                        }
                      ></span>
                      <span className='capitalize'>
                        {itemConfig?.label || item.name}
                      </span>
                      : <strong>{item.value}</strong>
                    </li>
                  );
                })}
            </ul>
          </div>
          <div>
            <h2 className='text-base'>{t('COSTS')}</h2>
            <ul>
              {[
                { label: 'WATER', value: item?.payload?.cost?.water },

                { label: 'GAS', value: item?.payload?.cost?.gas },
                ...(isSingle
                  ? [
                      {
                        label: 'ELECTRICITY',
                        value: item?.payload?.cost?.electricity?.single,
                      },
                    ]
                  : [
                      {
                        label: 'ELECTRICITY_DAY',
                        value: item?.payload?.cost?.electricity?.day,
                      },
                      {
                        label: 'ELECTRICITY_NIGHT',
                        value: item?.payload?.cost?.electricity?.night,
                      },
                    ]),
                { label: 'TOTAL', value: item?.payload?.cost?.total },
              ].map(i => (
                <li key={i.label}>
                  <span className='capitalize'>{t(i.label)}</span>:&nbsp;
                  <strong>{formatCurrencySymbol(i.value)}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyChartTooltip;
