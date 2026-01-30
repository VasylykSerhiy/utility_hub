import type {
  CreatePropertySchema,
  UpdatePropertySchema,
} from '@workspace/utils';

import { supabase } from '../configs/supabase';
import {
  createEmptyReading,
  mapPropertyToFrontend,
  mapReadingToFrontend,
  mapTariffToFrontend,
} from '../mappers/property.mappers';
import { findTariffForDate } from './tariff.service';

const getProperties = async (userId: string) => {
  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return await Promise.all(
    properties.map(async prop => {
      const { data: lastReading } = await supabase
        .from('view_readings_stats')
        .select('*')
        .eq('property_id', prop.id)
        .order('date', { ascending: false })
        .limit(1)
        .single();

      let historicalTariff = null;
      if (lastReading) {
        historicalTariff = await findTariffForDate(prop.id, lastReading.date);
      }

      const { data: currentTariff } = await supabase
        .from('tariffs')
        .select('*')
        .eq('property_id', prop.id)
        .order('start_date', { ascending: false })
        .limit(1)
        .single();

      const mappedLastReading = lastReading
        ? mapReadingToFrontend(
            lastReading,
            historicalTariff,
            prop.electricity_type,
          )
        : createEmptyReading(prop.electricity_type, prop.id);

      const mappedCurrentTariff = currentTariff
        ? mapTariffToFrontend(currentTariff)
        : null;

      return mapPropertyToFrontend(
        prop,
        mappedLastReading,
        mappedCurrentTariff,
      );
    }),
  );
};

const getProperty = async (userId: string, propertyId: string) => {
  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .eq('user_id', userId)
    .single();

  if (error || !property) throw new Error('Property not found');

  const { data: lastReading } = await supabase
    .from('view_readings_stats')
    .select('*')
    .eq('property_id', propertyId)
    .order('date', { ascending: false })
    .limit(1)
    .single();

  let historicalTariff = null;
  if (lastReading) {
    historicalTariff = await findTariffForDate(propertyId, lastReading.date);
  }

  const { data: currentTariff } = await supabase
    .from('tariffs')
    .select('*')
    .eq('property_id', propertyId)
    .order('start_date', { ascending: false })
    .limit(1)
    .single();

  const mappedLastReading = lastReading
    ? mapReadingToFrontend(
        lastReading,
        historicalTariff,
        property.electricity_type,
      )
    : createEmptyReading(property.electricity_type, propertyId);

  const mappedCurrentTariff = currentTariff
    ? mapTariffToFrontend(currentTariff)
    : null;

  return mapPropertyToFrontend(
    property,
    mappedLastReading,
    mappedCurrentTariff,
  );
};

const createProperty = async ({
  userId,
  data,
}: {
  userId: string;
  data: CreatePropertySchema;
}) => {
  const { tariffs, fixedCosts, ...propData } = data;

  const { data: newProp, error: propError } = await supabase
    .from('properties')
    .insert({
      user_id: userId,
      name: propData.name,
      electricity_type: tariffs.electricity.type,
    })
    .select()
    .single();

  if (propError)
    throw new Error(`Failed to create property: ${propError.message}`);

  const { error: tariffError } = await supabase.from('tariffs').insert({
    property_id: newProp.id,
    start_date: new Date('1900-01-01').toISOString(),
    ...(tariffs?.electricity.type === 'single' && {
      rate_electricity_single: tariffs.electricity?.single,
      rate_electricity_day: 0,
      rate_electricity_night: 0,
    }),
    ...(tariffs?.electricity.type === 'double' && {
      rate_electricity_single: 0,
      rate_electricity_day: tariffs.electricity.day,
      rate_electricity_night: tariffs.electricity.night,
    }),
    rate_water: tariffs?.water || 0,
    rate_gas: tariffs?.gas || 0,
    fixed_internet: fixedCosts?.internet || 0,
    fixed_maintenance: fixedCosts?.maintenance || 0,
    fixed_gas_delivery: fixedCosts?.gas_delivery || 0,
  });

  if (tariffError) {
    await supabase.from('properties').delete().eq('id', newProp.id);
    throw new Error(`Failed to create tariff: ${tariffError.message}`);
  }

  return mapPropertyToFrontend(newProp);
};

const updateProperty = async ({
  userId,
  propertyId,
  data,
}: {
  userId: string;
  propertyId: string;
  data: UpdatePropertySchema;
}) => {
  const { data: property, error: fetchError } = await supabase
    .from('properties')
    .select('id')
    .eq('id', propertyId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !property) throw new Error('Property not found');

  const { tariffs, fixedCosts } = data;
  const electricityType = data.tariffs?.electricity?.type;

  if (electricityType) {
    await supabase
      .from('properties')
      .update({
        ...(electricityType && { electricity_type: electricityType }),
      })
      .eq('id', propertyId);
  }

  if (tariffs || fixedCosts) {
    const now = new Date().toISOString();

    await supabase
      .from('tariffs')
      .update({ end_date: now })
      .eq('property_id', propertyId)
      .is('end_date', null);

    await supabase.from('tariffs').insert({
      property_id: propertyId,
      start_date: now,
      ...(tariffs?.electricity.type === 'single' && {
        rate_electricity_single: tariffs.electricity?.single,
        rate_electricity_day: 0,
        rate_electricity_night: 0,
      }),
      ...(tariffs?.electricity.type === 'double' && {
        rate_electricity_single: 0,
        rate_electricity_day: tariffs.electricity.day,
        rate_electricity_night: tariffs.electricity.night,
      }),
      rate_water: tariffs?.water ?? 0,
      rate_gas: tariffs?.gas ?? 0,
      fixed_internet: fixedCosts?.internet ?? 0,
      fixed_maintenance: fixedCosts?.maintenance ?? 0,
      fixed_gas_delivery: fixedCosts?.gas_delivery ?? 0,
    });
  }

  return { success: true };
};

const deleteProperty = async ({
  userId,
  propertyId,
}: {
  userId: string;
  propertyId: string;
}) => {
  const { data, error } = await supabase
    .from('properties')
    .delete()
    .eq('id', propertyId)
    .eq('user_id', userId)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Error deleting property:', error);
    throw new Error(`Failed to delete property: ${error.message}`);
  }

  if (!data) {
    throw new Error('Property not found or access denied');
  }

  return { success: true };
};

const getMetrics = async ({ propertyId }: { propertyId: string }) => {
  const today = new Date();
  const oneYearAgo = new Date(
    today.getFullYear() - 1,
    today.getMonth() - 1,
    1,
  ).toISOString();

  const { data: property } = await supabase
    .from('properties')
    .select('electricity_type')
    .eq('id', propertyId)
    .single();

  const electricityType = property?.electricity_type || 'single';

  const { data: readings, error } = await supabase
    .from('view_readings_stats')
    .select('*')
    .eq('property_id', propertyId)
    .gte('date', oneYearAgo)
    .order('date', { ascending: true });

  if (error) throw new Error(error.message);

  return await Promise.all(
    readings.map(async r => {
      const tariff = await findTariffForDate(propertyId, r.date);
      return mapReadingToFrontend(r, tariff, electricityType);
    }),
  );
};

export default {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  getProperty,
  getMetrics,
};
