import type { MonthSchema } from '@workspace/utils';

import { supabase } from '../configs/supabase';
import { mapFormDataToDb, mapReadingToFrontend } from '../mappers/property.mappers';
import { findTariffForDate } from './tariff.service';

/** UA: Список колонок заміни лічильника в таблиці readings (view їх не повертає). EN: Replacement columns in readings table (view does not return them). */
const REPLACEMENT_COLUMNS =
  'electricity_baseline_single,electricity_baseline_day,electricity_baseline_night,electricity_old_final_single,electricity_old_final_day,electricity_old_final_night,water_baseline,water_old_final,gas_baseline,gas_old_final' as const;

/** UA: Доповнює рядок з view полями заміни з таблиці readings. EN: Enriches view row with replacement columns from readings table. */
export async function enrichWithReplacement<T extends Record<string, unknown>>(
  viewRow: T,
  readingId: string,
): Promise<T> {
  const { data: raw } = await supabase
    .from('readings')
    .select(REPLACEMENT_COLUMNS)
    .eq('id', readingId)
    .single();
  if (!raw) return viewRow;
  return { ...viewRow, ...raw } as T;
}

/** UA: Доповнює масив рядків з view полями заміни з readings. EN: Enriches view rows with replacement columns from readings. */
export async function enrichRowsWithReplacement<T extends Record<string, unknown> & { id: string }>(
  viewRows: T[],
): Promise<T[]> {
  if (viewRows.length === 0) return viewRows;
  const ids = viewRows.map(r => r.id);
  const { data: rawRows } = await supabase
    .from('readings')
    .select(`id,${REPLACEMENT_COLUMNS}`)
    .in('id', ids);
  if (!rawRows?.length) return viewRows;
  const byId = new Map(rawRows.map(r => [r.id, r]));
  return viewRows.map(row => {
    const replacement = byId.get(row.id);
    return (replacement ? { ...row, ...replacement } : row) as T;
  });
}

const getMonths = async ({
  propertyId,
  page = 1,
  pageSize = 10,
}: {
  propertyId: string;
  page: number;
  pageSize: number;
}) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: property } = await supabase
    .from('properties')
    .select('electricity_type')
    .eq('id', propertyId)
    .single();

  const electricityType = property?.electricity_type || 'single';

  const {
    data: rows,
    count,
    error,
  } = await supabase
    .from('view_readings_stats')
    .select('*', { count: 'exact' })
    .eq('property_id', propertyId)
    .order('date', { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);

  const rowsWithReplacement = await enrichRowsWithReplacement(rows);
  const resultData = await Promise.all(
    rowsWithReplacement.map(async r => {
      const tariff = await findTariffForDate(propertyId, r.date);
      return mapReadingToFrontend(r, tariff, electricityType);
    }),
  );

  return {
    data: resultData,
    total: count,
    page,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
};

interface GetMonthParams {
  userId: string;
  propertyId: string;
  monthId: string;
}

const getMonth = async ({ userId, propertyId, monthId }: GetMonthParams) => {
  const { data: property, error: propError } = await supabase
    .from('properties')
    .select('electricity_type, user_id')
    .eq('id', propertyId)
    .single();

  if (propError || !property) {
    throw new Error('Property not found');
  }

  if (property.user_id !== userId) {
    console.log(property.user_id, userId);
    throw new Error('Access denied');
  }

  const electricityType = property.electricity_type || 'single';

  const { data: reading, error: readingError } = await supabase
    .from('view_readings_stats')
    .select('*')
    .eq('id', monthId)
    .eq('property_id', propertyId)
    .single();

  if (readingError || !reading) {
    throw new Error('Reading record not found');
  }

  const readingEnriched = await enrichWithReplacement(reading, monthId);
  const tariff = await findTariffForDate(propertyId, readingEnriched.date);

  return mapReadingToFrontend(readingEnriched, tariff, electricityType);
};

const createMonth = async ({
  userId,
  propertyId,
  data,
}: {
  userId: string;
  propertyId: string;
  data: MonthSchema;
}) => {
  const { data: property } = await supabase
    .from('properties')
    .select('id, electricity_type')
    .eq('id', propertyId)
    .eq('user_id', userId)
    .single();

  if (!property) throw new Error('Property not found');

  const insertPayload = mapFormDataToDb(data, propertyId);
  const { error, data: newReading } = await supabase
    .from('readings')
    .insert({
      ...insertPayload,
      property_id: propertyId,
      date: data.date,
      water: data.meters.water ?? 0,
      gas: data.meters.gas ?? 0,
      ...(data.meters.electricity?.type === 'single'
        ? {
            electricity_single: data.meters.electricity.single,
          }
        : {
            electricity_day: data.meters.electricity?.day ?? 0,
            electricity_night: data.meters.electricity?.night ?? 0,
          }),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  const { data: readingWithStats } = await supabase
    .from('view_readings_stats')
    .select('*')
    .eq('id', newReading.id)
    .single();

  const rowToMap = readingWithStats
    ? await enrichWithReplacement(readingWithStats, newReading.id)
    : newReading;
  const tariff = await findTariffForDate(propertyId, data.date);

  return mapReadingToFrontend(rowToMap, tariff, property.electricity_type);
};

const editMonth = async ({
  propertyId,
  monthId,
  data,
}: {
  propertyId: string;
  monthId: string;
  data: Partial<MonthSchema>;
}) => {
  const updatePayload = mapFormDataToDb(data);

  const { error } = await supabase
    .from('readings')
    .update(updatePayload)
    .eq('id', monthId)
    .eq('property_id', propertyId);

  if (error) {
    throw new Error(`Failed to update month: ${error.message}`);
  }

  const { data: readingWithStats } = await supabase
    .from('view_readings_stats')
    .select('*')
    .eq('id', monthId)
    .eq('property_id', propertyId)
    .single();

  if (!readingWithStats) {
    throw new Error('Failed to load updated reading');
  }

  const readingEnriched = await enrichWithReplacement(readingWithStats, monthId);
  const { data: property } = await supabase
    .from('properties')
    .select('electricity_type')
    .eq('id', propertyId)
    .single();

  const tariff = await findTariffForDate(propertyId, readingEnriched.date);

  return mapReadingToFrontend(readingEnriched, tariff, property?.electricity_type ?? null);
};

const deleteMonth = async ({ propertyId, monthId }: { propertyId: string; monthId: string }) => {
  const { data, error } = await supabase
    .from('readings')
    .delete()
    .eq('id', monthId)
    .eq('property_id', propertyId)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Error deleting month:', error);
    throw new Error(`Failed to delete month: ${error.message}`);
  }

  if (!data) {
    throw new Error('Month not found or access denied');
  }

  return { success: true };
};

export default { getMonth, getMonths, createMonth, editMonth, deleteMonth };
