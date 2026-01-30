import type { MonthSchema } from '@workspace/utils';

import { supabase } from '../configs/supabase';
import {
  mapFormDataToDb,
  mapReadingToFrontend,
} from '../mappers/property.mappers';
import { findTariffForDate } from './tariff.service';

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

  const resultData = await Promise.all(
    rows.map(async r => {
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

  const tariff = await findTariffForDate(propertyId, reading.date);

  return mapReadingToFrontend(reading, tariff, electricityType);
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

  const { error, data: newReading } = await supabase
    .from('readings')
    .insert({
      property_id: propertyId,
      date: data.date,
      water: data.meters.water || 0,
      gas: data.meters.gas || 0,
      ...(data.meters.electricity?.type === 'single'
        ? {
            electricity_single: data.meters.electricity.single,
          }
        : {
            electricity_day: data.meters.electricity?.day || 0,
            electricity_night: data.meters.electricity?.night || 0,
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

  const tariff = await findTariffForDate(propertyId, data.date);

  return mapReadingToFrontend(
    readingWithStats || newReading,
    tariff,
    property.electricity_type,
  );
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

  const { data: updatedData, error } = await supabase
    .from('readings')
    .update(updatePayload)
    .eq('id', monthId)
    .eq('property_id', propertyId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update month: ${error.message}`);
  }

  return updatedData;
};

const deleteMonth = async ({
  propertyId,
  monthId,
}: {
  propertyId: string;
  monthId: string;
}) => {
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
