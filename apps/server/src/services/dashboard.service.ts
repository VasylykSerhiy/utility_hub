/**
 * Dashboard Service
 * UA: Сервіс аналітики дашборду — агрегація витрат по нерухомості, місяцях та трендах.
 * EN: Dashboard analytics service — aggregates spending by property, month, and trends.
 */
import type {
  CategoryBreakdown,
  FullDashboardData,
  MonthTrend,
  PropertyCost,
} from '@workspace/types';
import { format, getDate, startOfMonth, subMonths } from 'date-fns';

import { supabase } from '../configs/supabase';

// --- Database Interfaces / Інтерфейси даних з БД ---
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

// --- Helpers: dates & defaults / Допоміжні: дати та дефолти ---

/**
 * EN: Threshold for "Accounting Month" (1st-5th belongs to prev month).
 * UA: Поріг для "Розрахункового місяця" (1-5 число відноситься до попереднього місяця).
 */
const getLogicalMonthKey = (date: Date): string => {
  const day = getDate(date);
  if (day <= 5) return format(subMonths(date, 1), 'yyyy-MM');
  return format(date, 'yyyy-MM');
};

const DEFAULT_STATS: CategoryBreakdown & { total: number } = {
  water: 0,
  gas: 0,
  electricity: 0,
  fixed: 0,
  total: 0,
};

// --- Aggregation helpers / Допоміжні для агрегації ---

/** UA: Додає витрати одного періоду до monthlyStats і до списку витрат по об'єктах. EN: Adds one period's costs to monthlyStats and propertyCostsByMonth. */
const accumulateReadingCosts = (
  logicalKey: string,
  costs: { water: number; gas: number; electricity: number; fixed: number; total: number },
  propName: string,
  monthlyStats: Map<string, CategoryBreakdown & { total: number }>,
  propertyCostsByMonth: Map<string, PropertyCost[]>,
): void => {
  const existing = monthlyStats.get(logicalKey) || DEFAULT_STATS;
  monthlyStats.set(logicalKey, {
    water: existing.water + costs.water,
    gas: existing.gas + costs.gas,
    electricity: existing.electricity + costs.electricity,
    fixed: existing.fixed + costs.fixed,
    total: existing.total + costs.total,
  });
  const propCosts = propertyCostsByMonth.get(logicalKey) || [];
  propCosts.push({ name: propName, total: Number(costs.total.toFixed(2)) });
  propertyCostsByMonth.set(logicalKey, propCosts);
};

/** UA: Обробляє одну пару показань (поточне + попереднє), рахує витрати, накопичує в мапах. EN: Processes one reading pair, calculates costs, accumulates into maps. */
const processOneReading = (
  reading: DatabaseReading,
  prev: DatabaseReading,
  tariff: DatabaseTariff,
  propName: string,
  monthlyStats: Map<string, CategoryBreakdown & { total: number }>,
  propertyCostsByMonth: Map<string, PropertyCost[]>,
): string => {
  const logicalKey = getLogicalMonthKey(new Date(reading.date));
  const costs = calculateCosts(reading, prev, tariff);
  accumulateReadingCosts(logicalKey, costs, propName, monthlyStats, propertyCostsByMonth);
  return logicalKey;
};

/** UA: Чи вважати об'єкт "з незакритими показаннями" (до 28-го — попередній місяць, з 28-го — поточний). EN: Whether to count property as having pending readings (target month depends on day). */
const shouldCountPendingReadings = (
  latestReadingLogicalKey: string,
  currentDay: number,
  currentLogicalKey: string,
  prevMonthKey: string,
): boolean => {
  const isLateInMonth = currentDay >= 28;
  const targetKey = isLateInMonth ? currentLogicalKey : prevMonthKey;
  return !latestReadingLogicalKey || latestReadingLogicalKey < targetKey;
};

/** UA: Проходить по всіх показаннях одного об'єкта (пари по даті), оновлює мапи, повертає останні ключі. EN: Iterates readings of one property, updates maps, returns latest logical/month keys. */
const processPropertyReadings = (
  prop: DatabaseProperty,
  monthlyStats: Map<string, CategoryBreakdown & { total: number }>,
  propertyCostsByMonth: Map<string, PropertyCost[]>,
): { latestReadingLogicalKey: string; latestDataKey: string } => {
  const sorted = [...(prop.readings || [])].sort((a, b) => a.date.localeCompare(b.date));
  const tariff = prop.tariffs?.[0];
  if (!tariff) return { latestReadingLogicalKey: '', latestDataKey: '' };

  let latestReadingLogicalKey = '';
  let latestDataKey = '';

  for (let index = 1; index < sorted.length; index++) {
    const reading = sorted[index];
    const prev = sorted[index - 1];
    const logicalKey = processOneReading(
      reading,
      prev,
      tariff,
      prop.name,
      monthlyStats,
      propertyCostsByMonth,
    );
    if (logicalKey > latestReadingLogicalKey) latestReadingLogicalKey = logicalKey;
    if (logicalKey > latestDataKey) latestDataKey = logicalKey;
  }
  return { latestReadingLogicalKey, latestDataKey };
};

/** UA: Результат агрегації по всіх об'єктах. EN: Result of aggregating all properties. */
interface AggregateResult {
  monthlyStats: Map<string, CategoryBreakdown & { total: number }>;
  propertyCostsByMonth: Map<string, PropertyCost[]>;
  latestDataKey: string;
  pendingReadingsCount: number;
}

/** UA: Агрегує витрати по всіх об'єктах користувача та рахує "незакриті" показання. EN: Aggregates costs across all user properties and counts pending readings. */
const aggregateAllProperties = (
  typedProperties: DatabaseProperty[],
  currentDay: number,
  currentLogicalKey: string,
  prevMonthKey: string,
): AggregateResult => {
  const monthlyStats = new Map<string, CategoryBreakdown & { total: number }>();
  const propertyCostsByMonth = new Map<string, PropertyCost[]>();
  let latestDataKey = '';
  let pendingReadingsCount = 0;

  for (const prop of typedProperties) {
    const { latestReadingLogicalKey, latestDataKey: propLatestDataKey } = processPropertyReadings(
      prop,
      monthlyStats,
      propertyCostsByMonth,
    );
    if (propLatestDataKey > latestDataKey) latestDataKey = propLatestDataKey;
    if (
      shouldCountPendingReadings(
        latestReadingLogicalKey,
        currentDay,
        currentLogicalKey,
        prevMonthKey,
      )
    ) {
      pendingReadingsCount++;
    }
  }
  return { monthlyStats, propertyCostsByMonth, latestDataKey, pendingReadingsCount };
};

/** UA: Будує масив тренду за останні 6 місяців (місяць + сума). EN: Builds six-month trend array (month + total). */
const buildSixMonthTrend = (
  monthlyStats: Map<string, CategoryBreakdown & { total: number }>,
  latestDate: Date,
): MonthTrend[] => {
  const trend: MonthTrend[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = subMonths(latestDate, i);
    const key = format(d, 'yyyy-MM');
    trend.push({
      month: new Date(`${key}-01T00:00:00Z`),
      total: Number((monthlyStats.get(key)?.total || 0).toFixed(2)),
    });
  }
  return trend;
};

// --- Cost calculation / Розрахунок витрат ---

/** UA: Рахує витрати між двома показаннями за тарифом (вода, газ, світло single/day-night, фікс). EN: Calculates costs between two readings using tariff (water, gas, electricity, fixed). */
const calculateCosts = (current: DatabaseReading, prev: DatabaseReading, t: DatabaseTariff) => {
  const water = Math.max(0, current.water - prev.water) * (Number(t.rate_water) || 0);
  const gas = Math.max(0, current.gas - prev.gas) * (Number(t.rate_gas) || 0);
  let electricity = 0;
  const rateDay = Number(t.rate_electricity_day) || Number(t.rate_electricity_single) || 0;
  const rateNight = Number(t.rate_electricity_night) || 0;

  if (
    current.electricity_day !== null &&
    current.electricity_night !== null &&
    prev.electricity_day !== null &&
    prev.electricity_night !== null
  ) {
    electricity =
      Math.max(0, current.electricity_day - prev.electricity_day) * rateDay +
      Math.max(0, current.electricity_night - prev.electricity_night) * rateNight;
  } else if (current.electricity_single !== null && prev.electricity_single !== null) {
    electricity = Math.max(0, current.electricity_single - prev.electricity_single) * rateDay;
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

// --- Public API / Публічний API ---

/**
 * UA: Завантажує нерухомості з показаннями/тарифами, агрегує витрати по місяцях, повертає дані для дашборду.
 * EN: Loads properties with readings/tariffs, aggregates spending by month, returns dashboard payload.
 */
export const getDashboardAnalytics = async (userId: string): Promise<FullDashboardData> => {
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

  // UA: Агрегація по всіх об'єктах. EN: Aggregate across all properties.
  const { monthlyStats, propertyCostsByMonth, latestDataKey, pendingReadingsCount } =
    aggregateAllProperties(typedProperties, currentDay, currentLogicalKey, prevMonthKey);

  // UA: Ключ "останнього" місяця з даними; якщо немає — поточний. EN: Latest month with data, or current.
  const effectiveLatestKey = latestDataKey || currentLogicalKey;
  const latestDate = new Date(`${effectiveLatestKey}-01T00:00:00Z`);
  const previousKey = format(subMonths(latestDate, 1), 'yyyy-MM');

  const latestStats = monthlyStats.get(effectiveLatestKey) || DEFAULT_STATS;
  const prevStatsTotal = monthlyStats.get(previousKey)?.total || 0;
  const sixMonthTrend = buildSixMonthTrend(monthlyStats, latestDate);

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
