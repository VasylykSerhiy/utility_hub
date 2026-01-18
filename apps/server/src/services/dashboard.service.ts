import {
  CategoryBreakdown,
  FullDashboardData,
  MonthTrend,
  PropertyCost,
} from '@workspace/types';
import { format, getDate, startOfMonth, subMonths } from 'date-fns';

import { supabase } from '../configs/supabase';

// --- Database Interfaces ---
interface DatabaseTariff {
  rate_water: number | null;
  rate_gas: number | null;
  rate_electricity_day: number | null;
  rate_electricity_night: number | null;
  rate_electricity_single: number | null;
  fixed_internet: number | null;
  fixed_maintenance: number | null;
  fixed_gas_delivery: number | null;
}

interface DatabaseReading {
  date: string;
  water: number;
  gas: number;
  electricity_day: number | null;
  electricity_night: number | null;
  electricity_single: number | null;
}

interface DatabaseProperty {
  id: string;
  name: string;
  electricity_type: 'single' | 'double';
  readings: DatabaseReading[];
  tariffs: DatabaseTariff[];
}

/**
 * EN: Threshold for "Accounting Month" (1st-10th belongs to prev month).
 * UA: Поріг для "Розрахункового місяця" (1-10 число відноситься до попереднього місяця).
 */
const getLogicalMonthKey = (date: Date): string => {
  const day = getDate(date);
  if (day <= 10) return format(subMonths(date, 1), 'yyyy-MM');
  return format(date, 'yyyy-MM');
};

const calculateCosts = (
  current: DatabaseReading,
  prev: DatabaseReading,
  t: DatabaseTariff,
) => {
  const water =
    Math.max(0, current.water - prev.water) * (Number(t.rate_water) || 0);
  const gas = Math.max(0, current.gas - prev.gas) * (Number(t.rate_gas) || 0);
  let electricity = 0;
  const rateDay =
    Number(t.rate_electricity_day) || Number(t.rate_electricity_single) || 0;
  const rateNight = Number(t.rate_electricity_night) || 0;

  if (
    current.electricity_day !== null &&
    current.electricity_night !== null &&
    prev.electricity_day !== null &&
    prev.electricity_night !== null
  ) {
    electricity =
      Math.max(0, current.electricity_day - prev.electricity_day) * rateDay +
      Math.max(0, current.electricity_night - prev.electricity_night) *
        rateNight;
  } else if (
    current.electricity_single !== null &&
    prev.electricity_single !== null
  ) {
    electricity =
      Math.max(0, current.electricity_single - prev.electricity_single) *
      rateDay;
  }

  const fixed =
    (Number(t.fixed_internet) || 0) +
    (Number(t.fixed_maintenance) || 0) +
    (Number(t.fixed_gas_delivery) || 0);
  return {
    water,
    gas,
    electricity,
    fixed,
    total: water + gas + electricity + fixed,
  };
};

export const getDashboardAnalytics = async (
  userId: string,
): Promise<FullDashboardData> => {
  const today = new Date();
  const currentDay = getDate(today);
  const currentLogicalKey = getLogicalMonthKey(today);
  const prevMonthKey = format(subMonths(today, 1), 'yyyy-MM');

  const rangeStart = startOfMonth(subMonths(today, 12));
  const { data: properties, error } = await supabase
    .from('properties')
    .select('*, readings (*), tariffs (*)')
    .eq('user_id', userId)
    .gte('readings.date', format(rangeStart, 'yyyy-MM-dd'));

  if (error) throw new Error('Failed to load dashboard data');
  const typedProperties = properties as unknown as DatabaseProperty[];

  const monthlyStats = new Map<string, CategoryBreakdown & { total: number }>();
  const propertyCostsByMonth = new Map<string, PropertyCost[]>();
  let latestDataKey = '';
  let pendingReadingsCount = 0;

  typedProperties.forEach(prop => {
    const sorted = [...(prop.readings || [])].sort((a, b) =>
      a.date.localeCompare(b.date),
    );
    const tariff = prop.tariffs?.[0];
    if (!tariff) return;

    let latestReadingLogicalKey = '';

    sorted.forEach((reading, index) => {
      const prev = sorted[index - 1];
      if (!prev) return;

      const logicalKey = getLogicalMonthKey(new Date(reading.date));
      if (logicalKey > latestReadingLogicalKey)
        latestReadingLogicalKey = logicalKey;

      const costs = calculateCosts(reading, prev, tariff);
      const existing = monthlyStats.get(logicalKey) || {
        water: 0,
        gas: 0,
        electricity: 0,
        fixed: 0,
        total: 0,
      };

      monthlyStats.set(logicalKey, {
        water: existing.water + costs.water,
        gas: existing.gas + costs.gas,
        electricity: existing.electricity + costs.electricity,
        fixed: existing.fixed + costs.fixed,
        total: existing.total + costs.total,
      });

      const propCosts = propertyCostsByMonth.get(logicalKey) || [];
      propCosts.push({
        name: prop.name,
        total: Number(costs.total.toFixed(2)),
      });
      propertyCostsByMonth.set(logicalKey, propCosts);

      if (logicalKey > latestDataKey) latestDataKey = logicalKey;
    });

    // 1. Якщо сьогодні до 26-го числа, нас цікавить лише чи закритий ПОПЕРЕДНІЙ місяць.
    // 2. Якщо сьогодні 26-те і пізніше, ми очікуємо, що і поточний місяць буде закритий.
    const isLateInMonth = currentDay >= 26;
    const targetKey = isLateInMonth ? currentLogicalKey : prevMonthKey;

    if (!latestReadingLogicalKey || latestReadingLogicalKey < targetKey) {
      pendingReadingsCount++;
    }
  });

  const effectiveLatestKey = latestDataKey || currentLogicalKey;
  const latestDate = new Date(`${effectiveLatestKey}-01T00:00:00Z`);
  const previousKey = format(subMonths(latestDate, 1), 'yyyy-MM');

  const latestStats = monthlyStats.get(effectiveLatestKey) || {
    water: 0,
    gas: 0,
    electricity: 0,
    fixed: 0,
    total: 0,
  };
  const prevStatsTotal = monthlyStats.get(previousKey)?.total || 0;

  const sixMonthTrend: MonthTrend[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = subMonths(latestDate, i);
    const key = format(d, 'yyyy-MM');
    sixMonthTrend.push({
      month: new Date(`${key}-01T00:00:00Z`),
      total: Number((monthlyStats.get(key)?.total || 0).toFixed(2)),
    });
  }

  return {
    currentMonthName: latestDate.toISOString(),
    totalSpentCurrentMonth: Number(latestStats.total.toFixed(2)),
    totalSpentLastMonth: Number(prevStatsTotal.toFixed(2)),
    pendingReadingsCount,
    activeProperties: typedProperties.length,
    spendingBreakdown: {
      water: Number(latestStats.water.toFixed(2)),
      gas: Number(latestStats.gas.toFixed(2)),
      electricity: Number(latestStats.electricity.toFixed(2)),
      fixed: Number(latestStats.fixed.toFixed(2)),
    },
    costByProperty: propertyCostsByMonth.get(effectiveLatestKey) || [],
    sixMonthTrend,
  };
};

export default { getDashboardAnalytics };
