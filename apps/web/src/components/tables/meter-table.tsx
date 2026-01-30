'use client';

import { IElectricityType, type LastReading } from '@workspace/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { numericFormatter } from '@workspace/utils';
import { useTranslation } from 'react-i18next';

interface Row {
  meter: string;
  reading: number;
  consumption: number;
  const: number;
}

interface IMeterTableProps {
  lastReading: LastReading;
}

export const generateRows = (
  lastReading: LastReading,
  t: (key: string) => string,
): Row[] => {
  const tariffs = lastReading?.tariff?.tariffs ?? {};
  const meters = lastReading?.meters ?? {};
  const diff = lastReading?.difference ?? {};

  const rows: Row[] = [];

  // ⚡️ Світло
  if (lastReading?.electricityType === IElectricityType.SINGLE) {
    const consumption = diff.electricity.single ?? 0;

    rows.push({
      meter: t('ELECTRICITY'),
      reading: meters?.electricity?.single ?? 0,
      consumption,
      const: consumption * (tariffs?.electricity?.single ?? 0),
    });
  } else if (lastReading?.electricityType === IElectricityType.DOUBLE) {
    (['day', 'night'] as const).forEach(period => {
      const consumption = diff?.electricity?.[period] ?? 0;
      rows.push({
        meter: t(`ELECTRICITY_${period.toUpperCase()}`),
        reading: meters?.electricity?.[period] ?? 0,
        consumption,
        const: consumption * (tariffs?.electricity?.[period] ?? 0),
      });
    });
  }

  // 💧 Вода
  const waterConsumption = diff.water ?? 0;
  rows.push({
    meter: t('WATER'),
    reading: meters.water ?? 0,
    consumption: waterConsumption,
    const: waterConsumption * (tariffs.water ?? 0),
  });

  // 🔥 Газ
  const gasConsumption = diff.gas ?? 0;
  rows.push({
    meter: t('GAS'),
    reading: meters.gas ?? 0,
    consumption: gasConsumption,
    const: gasConsumption * (tariffs.gas ?? 0),
  });

  return rows;
};

const MeterTable = ({ lastReading }: IMeterTableProps) => {
  const { t } = useTranslation();
  const rows = generateRows(lastReading, t);

  return (
    <Table classNameWrapper='border-none'>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[100px]'>{t('METER')}</TableHead>
          <TableHead>{t('READING')}</TableHead>
          <TableHead>{t('CONSUMPTION')}</TableHead>
          <TableHead className='text-right'>{t('COSTS')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows?.map(row => (
          <TableRow className='w-full' key={row.meter}>
            <TableCell className='font-medium'>{row.meter}</TableCell>
            <TableCell>{numericFormatter(row.reading)}</TableCell>
            <TableCell>{numericFormatter(row.consumption)}</TableCell>
            <TableCell className='text-right'>
              {numericFormatter(row.const, { suffix: ' ₴' })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MeterTable;
