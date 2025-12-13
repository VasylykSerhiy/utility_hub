import {CreatePropertySchema, MonthSchema, UpdatePropertySchema,} from '@workspace/utils';

import {supabase} from '../configs/supabase';

// --- MAPPERS (Data Transformation Layer) ---
const createEmptyReading = (
  electricityType: 'single' | 'double' | null = 'single',
) => ({
  id: null,
  electricityType,
  date: null,
  meters: {
    water: 0,
    gas: 0,
    electricity: {
      single: 0,
      day: 0,
      night: 0,
    },
  },
  difference: {
    water: 0,
    gas: 0,
    electricity: {
      single: 0,
      day: 0,
      night: 0,
    },
  },
  prevMeters: {
    water: 0,
    gas: 0,
    electricity: {
      single: 0,
      day: 0,
      night: 0,
    },
  },
  tariff: null,
  total: 0,
  createdAt: null,
});

// 1. TARIFF MAPPER
const mapTariffToFrontend = (tariff: any) => ({
  id: tariff.id,
  startDate: tariff.start_date,
  endDate: tariff.end_date,
  tariffs: {
    electricity: {
      single: tariff.rate_electricity_single,
      day: tariff.rate_electricity_day,
      night: tariff.rate_electricity_night,
    },
    water: tariff.rate_water,
    gas: tariff.rate_gas,
  },
  fixedCosts: {
    internet: tariff.fixed_internet,
    maintenance: tariff.fixed_maintenance,
    gas_delivery: tariff.fixed_gas_delivery,
  },
});

// 2. TOTAL CALCULATOR
const calculateTotal = (diff: any, tariff: any) => {
  if (!tariff) return 0;

  let electricityCost: number;
  if (diff.electricity_day > 0 || diff.electricity_night > 0) {
    electricityCost =
      diff.electricity_day * tariff.rate_electricity_day +
      diff.electricity_night * tariff.rate_electricity_night;
  } else {
    electricityCost = diff.electricity_single * tariff.rate_electricity_single;
  }

  const waterCost = diff.water * tariff.rate_water;
  const gasCost = diff.gas * tariff.rate_gas;
  const fixedCost =
    tariff.fixed_internet +
    tariff.fixed_maintenance +
    tariff.fixed_gas_delivery;

  return (
    Math.round((electricityCost + waterCost + gasCost + fixedCost) * 100) / 100
  );
};

// 3. READING MAPPER
const mapReadingToFrontend = (
  reading: any,
  tariff: any = null,
  propertyElectricityType: 'single' | 'double' | null = null,
) => {
  // --- ЛОГІКА АВТОВИЗНАЧЕННЯ ТИПУ ---
  // Ми використовуємо тип з Property як дефолтний.
  // Але якщо ми бачимо, що в базі заповнені поля day/night (і вони не null),
  // то ми примусово ставимо тип 'double' для цього конкретного запису.
  // Це рятує історію, якщо ти поміняв лічильник.

  let actualType = propertyElectricityType || 'single';

  // Перевірка: чи є дані в двозонних колонках? (non-null check)
  if (reading.electricity_day !== null || reading.electricity_night !== null) {
    actualType = 'double';
  }
  // Перевірка: чи є дані в однозонній колонці?
  else if (reading.electricity_single !== null) {
    actualType = 'single';
  }

  const diff = {
    water: Math.max(reading.diff_water ?? 0, 0),
    gas: Math.max(reading.diff_gas ?? 0, 0),
    electricity_single: Math.max(reading.diff_electricity_single ?? 0, 0),
    electricity_day: Math.max(reading.diff_electricity_day ?? 0, 0),
    electricity_night: Math.max(reading.diff_electricity_night ?? 0, 0),
  };

  const total = tariff ? calculateTotal(diff, tariff) : 0;

  return {
    id: reading.id,
    electricityType: actualType,
    date: reading.date,
    meters: {
      water: reading.water,
      gas: reading.gas,
      electricity: {
        single: reading.electricity_single,
        day: reading.electricity_day,
        night: reading.electricity_night,
      },
    },
    difference: {
      water: diff.water,
      gas: diff.gas,
      electricity: {
        single: diff.electricity_single,
        day: diff.electricity_day,
        night: diff.electricity_night,
      },
    },
    prevMeters: {
      water: reading.prev_water ?? 0,
      gas: reading.prev_gas ?? 0,
      electricity: {
        single: reading.prev_electricity_single ?? 0,
        day: reading.prev_electricity_day ?? 0,
        night: reading.prev_electricity_night ?? 0,
      },
    },
    tariff: tariff ? mapTariffToFrontend(tariff) : null,
    total,
    createdAt: reading.created_at,
  };
};

const mapPropertyToFrontend = (
  prop: any,
  lastReading: any = null,
  currentTariff: any = null,
) => {
  return {
    id: prop.id,
    userId: prop.user_id,
    name: prop.name,
    electricityType: prop.electricity_type,
    createdAt: prop.created_at,
    updatedAt: prop.updated_at,
    lastReading,
    currentTariff,
  };
};

// --- DB HELPER ---
const findTariffForDate = async (propertyId: string, date: string | Date) => {
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

      const mappedLastReading = lastReading
        ? mapReadingToFrontend(
            lastReading,
            historicalTariff,
            prop.electricity_type,
          )
        : createEmptyReading(prop.electricity_type);

      return mapPropertyToFrontend(prop, mappedLastReading);
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
    : createEmptyReading(property.electricity_type);

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

  // Отримуємо тип з property
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

const getLastTariff = async (propertyId: string) => {
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

const getTariffs = async ({
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

  if (error) throw new Error(error.message);

  return {
    data: rows.map(mapTariffToFrontend),
    total: count,
    page,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
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
  getMonths,
  createMonth,
  getProperty,
  getLastTariff,
  getTariffs,
  getMetrics,
};
