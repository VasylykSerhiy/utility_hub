import type { MonthSchema } from '@workspace/utils';

// --- DB row types (snake_case from database) ---
// Типи рядків БД (snake_case з бази даних)

interface ReadingsDbRow {
  property_id?: string;
  date?: Date;
  water?: number;
  gas?: number;
  electricity_single?: number | null;
  electricity_day?: number | null;
  electricity_night?: number | null;
}

interface TariffDbRow {
  id: string;
  start_date: Date | string;
  end_date: Date | string | null;
  rate_electricity_single: number;
  rate_electricity_day: number;
  rate_electricity_night: number;
  rate_water: number;
  rate_gas: number;
  fixed_internet: number;
  fixed_maintenance: number;
  fixed_gas_delivery: number;
}

interface ReadingDbRow {
  id: string;
  property_id: string;
  date: Date | string;
  water: number | null;
  gas: number | null;
  electricity_single: number | null;
  electricity_day: number | null;
  electricity_night: number | null;
  diff_water?: number | null;
  diff_gas?: number | null;
  diff_electricity_single?: number | null;
  diff_electricity_day?: number | null;
  diff_electricity_night?: number | null;
  prev_water?: number | null;
  prev_gas?: number | null;
  prev_electricity_single?: number | null;
  prev_electricity_day?: number | null;
  prev_electricity_night?: number | null;
  created_at: string | null;
}

interface PropertyDbRow {
  id: string;
  user_id: string;
  name: string;
  electricity_type: 'single' | 'double' | null;
  created_at: string;
  updated_at: string;
}

// --- Diff shape for calculateTotal ---
// Форма різниці для calculateTotal

interface DiffForTotal {
  water: number;
  gas: number;
  electricity_single: number;
  electricity_day: number;
  electricity_night: number;
}

// --- Frontend (mapped) types ---
// Типи для фронту (результати маппінгу)

interface ElectricityRates {
  single: number;
  day: number;
  night: number;
}

interface TariffFrontend {
  id: string;
  startDate: Date | string;
  endDate: Date | string | null;
  tariffs: {
    electricity: ElectricityRates;
    water: number;
    gas: number;
  };
  fixedCosts: {
    internet: number;
    maintenance: number;
    gas_delivery: number;
  };
}

interface MetersShape {
  water: number | null;
  gas: number | null;
  electricity: {
    single: number | null;
    day: number | null;
    night: number | null;
  };
}

interface DifferenceShape {
  water: number;
  gas: number;
  electricity: {
    single: number;
    day: number;
    night: number;
  };
}

interface EmptyReadingReturn {
  id: null;
  electricityType: 'single' | 'double' | null;
  date: null;
  meters: {
    water: number;
    gas: number;
    electricity: { single: number; day: number; night: number };
  };
  difference: {
    water: number;
    gas: number;
    electricity: { single: number; day: number; night: number };
  };
  prevMeters: {
    water: number;
    gas: number;
    electricity: { single: number; day: number; night: number };
  };
  tariff: null;
  total: number;
  createdAt: null;
}

interface ReadingFrontend {
  id: string;
  propertyId: string;
  electricityType: 'single' | 'double';
  date: Date | string;
  meters: MetersShape;
  difference: DifferenceShape;
  prevMeters: {
    water: number;
    gas: number;
    electricity: { single: number; day: number; night: number };
  };
  tariff: TariffFrontend | null;
  total: number;
  createdAt: string | null;
}

interface PropertyFrontend {
  id: string;
  userId: string;
  name: string;
  electricityType: 'single' | 'double' | null;
  createdAt: string;
  updatedAt: string;
  lastReading: ReadingFrontend | EmptyReadingReturn | null;
  currentTariff: TariffFrontend | null;
}

// --- Helpers ---

function resolveElectricityType(
  reading: ReadingDbRow,
  propertyElectricityType: 'single' | 'double' | null,
): 'single' | 'double' {
  if (reading.electricity_day !== null || reading.electricity_night !== null) {
    return 'double';
  }
  if (reading.electricity_single !== null) {
    return 'single';
  }
  return (propertyElectricityType as 'single' | 'double') || 'single';
}

// --- Mappers ---

export const createEmptyReading = (
  electricityType: 'single' | 'double' | null = 'single',
  _propertyId?: string,
): EmptyReadingReturn => ({
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

export const mapTariffToFrontend = (tariff: TariffDbRow): TariffFrontend => ({
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

export const calculateTotal = (diff: DiffForTotal, tariff: TariffDbRow | null): number => {
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
  const fixedCost = tariff.fixed_internet + tariff.fixed_maintenance + tariff.fixed_gas_delivery;

  return Math.round((electricityCost + waterCost + gasCost + fixedCost) * 100) / 100;
};

export const mapFormDataToDb = (data: Partial<MonthSchema>, propertyId?: string): ReadingsDbRow => {
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
  reading: ReadingDbRow,
  tariff: TariffDbRow | null = null,
  propertyElectricityType: 'single' | 'double' | null = null,
): ReadingFrontend => {
  // --- ЛОГІКА АВТОВИЗНАЧЕННЯ ТИПУ ---
  // Ми використовуємо тип з Property як дефолтний.
  // Але якщо ми бачимо, що в базі заповнені поля day/night (і вони не null),
  // то ми примусово ставимо тип 'double' для цього конкретного запису.
  // Це рятує історію, якщо ти поміняв лічильник.
  //
  // --- Type auto-detection logic ---
  // We use Property type as default. If day/night are filled in DB (not null),
  // we force 'double' for this record (handles meter type change in history).

  const actualType = resolveElectricityType(reading, propertyElectricityType);

  const diff: DiffForTotal = {
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
  prop: PropertyDbRow,
  lastReading: ReadingFrontend | EmptyReadingReturn | null = null,
  currentTariff: TariffFrontend | null = null,
): PropertyFrontend => ({
  id: prop.id,
  userId: prop.user_id,
  name: prop.name,
  electricityType: prop.electricity_type,
  createdAt: prop.created_at,
  updatedAt: prop.updated_at,
  lastReading,
  currentTariff,
});
