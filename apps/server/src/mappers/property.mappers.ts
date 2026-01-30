import type { MonthSchema } from '@workspace/utils';

interface ReadingsDbRow {
  property_id?: string;
  date?: Date;
  water?: number;
  gas?: number;
  electricity_single?: number | null;
  electricity_day?: number | null;
  electricity_night?: number | null;
}

/** DB/API tariff shape (snake_case) */
interface TariffDb {
  id: string;
  start_date: string;
  end_date: string;
  rate_electricity_single: number;
  rate_electricity_day: number;
  rate_electricity_night: number;
  rate_water: number;
  rate_gas: number;
  fixed_internet: number;
  fixed_maintenance: number;
  fixed_gas_delivery: number;
}

/** Difference shape for calculateTotal */
interface DiffShape {
  water: number;
  gas: number;
  electricity_single: number;
  electricity_day: number;
  electricity_night: number;
}

/** DB/API reading shape (snake_case) */
interface ReadingDb {
  id: string;
  property_id: string;
  date: string;
  water: number;
  gas: number;
  electricity_single: number | null;
  electricity_day: number | null;
  electricity_night: number | null;
  diff_water?: number;
  diff_gas?: number;
  diff_electricity_single?: number;
  diff_electricity_day?: number;
  diff_electricity_night?: number;
  prev_water?: number;
  prev_gas?: number;
  prev_electricity_single?: number;
  prev_electricity_day?: number;
  prev_electricity_night?: number;
  created_at: string;
}

/** DB/API property shape (snake_case) */
interface PropertyDb {
  id: string;
  user_id: string;
  name: string;
  electricity_type: 'single' | 'double';
  created_at: string;
  updated_at: string;
}

export const createEmptyReading = (
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

export const mapTariffToFrontend = (tariff: TariffDb) => ({
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

export const calculateTotal = (diff: DiffShape, tariff: TariffDb) => {
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

export const mapFormDataToDb = (
  data: Partial<MonthSchema>,
  propertyId?: string,
): ReadingsDbRow => {
  const payload: ReadingsDbRow = {};

  if (propertyId) payload.property_id = propertyId;
  if (data.date) payload.date = data.date;
  if (data.meters?.water !== undefined) payload.water = data.meters.water;
  if (data.meters?.gas !== undefined) payload.gas = data.meters.gas;

  if (data.meters?.electricity) {
    const { electricity } = data.meters;

    if (electricity.type === 'single') {
      payload.electricity_single = electricity.single;
      payload.electricity_day = null;
      payload.electricity_night = null;
    } else {
      payload.electricity_day = electricity.day;
      payload.electricity_night = electricity.night;
      payload.electricity_single = null;
    }
  }

  return payload;
};

export const mapReadingToFrontend = (
  reading: ReadingDb,
  tariff: TariffDb | null = null,
  propertyElectricityType: 'single' | 'double' | null = null,
) => {
  // --- ЛОГІКА АВТОВИЗНАЧЕННЯ ТИПУ ---
  // Ми використовуємо тип з Property як дефолтний.
  // Але якщо ми бачимо, що в базі заповнені поля day/night (і вони не null),
  // то ми примусово ставимо тип 'double' для цього конкретного запису.
  // Це рятує історію, якщо ти поміняв лічильник.

  let actualType = propertyElectricityType || 'single';

  if (reading.electricity_day !== null || reading.electricity_night !== null) {
    actualType = 'double';
  } else if (reading.electricity_single !== null) {
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
    propertyId: reading.property_id,
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

export const mapPropertyToFrontend = (
  prop: PropertyDb,
  lastReading: ReturnType<typeof mapReadingToFrontend> | null = null,
  currentTariff: ReturnType<typeof mapTariffToFrontend> | null = null,
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
