import { supabase } from '../configs/supabase';
import { mapTariffToFrontend } from '../mappers/property.mappers';
import { serverError } from '../utils/http-errors';
import { ensureCanAccessProperty } from './property-access.service';

export const findTariffForDate = async (propertyId: string, date: string | Date) => {
  const { data } = await supabase
    .from('tariffs')
    .select('*')
    .eq('property_id', propertyId)
    .lte('start_date', date)
    .order('start_date', { ascending: false })
    .limit(1)
    .single();

  return data;
};

export const getLastTariff = async (userId: string, propertyId: string) => {
  await ensureCanAccessProperty(userId, propertyId);

  const { data, error } = await supabase
    .from('tariffs')
    .select('*')
    .eq('property_id', propertyId)
    .order('start_date', { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return mapTariffToFrontend(data);
};

export const getTariffs = async ({
  userId,
  propertyId,
  page = 1,
  pageSize = 10,
}: {
  userId: string;
  propertyId: string;
  page: number;
  pageSize: number;
}) => {
  await ensureCanAccessProperty(userId, propertyId);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const {
    data: rows,
    count,
    error,
  } = await supabase
    .from('tariffs')
    .select('*', { count: 'exact' })
    .eq('property_id', propertyId)
    .order('start_date', { ascending: false })
    .range(from, to);

  if (error) serverError('Failed to load tariffs', error);

  return {
    data: (rows ?? []).map(mapTariffToFrontend),
    total: count,
    page,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
};

export default {
  findTariffForDate,
  getLastTariff,
  getTariffs,
};
