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
  /** UA: Початкове значення нового лічильника при заміні. EN: New meter baseline when replaced. */
  electricity_baseline_single?: number | null;
  electricity_baseline_day?: number | null;
  electricity_baseline_night?: number | null;
  electricity_old_final_single?: number | null;
  electricity_old_final_day?: number | null;
  electricity_old_final_night?: number | null;
  water_baseline?: number | null;
  water_old_final?: number | null;
  gas_baseline?: number | null;
  gas_old_final?: number | null;
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
  electricity_baseline_single?: number | null;
  electricity_baseline_day?: number | null;
  electricity_baseline_night?: number | null;
  electricity_old_final_single?: number | null;
  electricity_old_final_day?: number | null;
  electricity_old_final_night?: number | null;
  water_baseline?: number | null;
  water_old_final?: number | null;
  gas_baseline?: number | null;
  gas_old_final?: number | null;
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

/**
 * UA: Рахує ефективну різницю для одного лічильника при заміні (baseline / old_final).
 * EN: Computes effective diff for one meter when replacement fields are set.
 */
function effectiveDiff(
  current: number | null,
  prev: number | null,
  baseline: number | null | undefined,
  oldFinal: number | null | undefined,
): number {
  if (current === null) return 0;
  const prevVal = prev ?? 0;
  if (oldFinal != null) {
    return Math.max(0, oldFinal - prevVal) + Math.max(0, current - (baseline ?? 0));
  }
  const effectivePrev = baseline != null ? baseline : prevVal;
  return Math.max(0, current - effectivePrev);
}

function diffOne(
  reading: ReadingDbRow,
  key: 'water' | 'gas',
  diffKey: 'diff_water' | 'diff_gas',
  prevKey: 'prev_water' | 'prev_gas',
  baselineKey: 'water_baseline' | 'gas_baseline',
  oldFinalKey: 'water_old_final' | 'gas_old_final',
): number {
  const current = reading[key];
  const hasReplacement = reading[baselineKey] != null || reading[oldFinalKey] != null;
  return hasReplacement
    ? effectiveDiff(
        current,
        reading[prevKey] ?? null,
        reading[baselineKey] ?? null,
        reading[oldFinalKey] ?? null,
      )
    : Math.max(reading[diffKey] ?? 0, 0);
}

const ELECTRICITY_KEYS: Record<
  'single' | 'day' | 'night',
  {
    current: keyof ReadingDbRow;
    prev: keyof ReadingDbRow;
    baseline: keyof ReadingDbRow;
    oldFinal: keyof ReadingDbRow;
    diff: keyof ReadingDbRow;
  }
> = {
  single: {
    current: 'electricity_single',
    prev: 'prev_electricity_single',
    baseline: 'electricity_baseline_single',
    oldFinal: 'electricity_old_final_single',
    diff: 'diff_electricity_single',
  },
  day: {
    current: 'electricity_day',
    prev: 'prev_electricity_day',
    baseline: 'electricity_baseline_day',
    oldFinal: 'electricity_old_final_day',
    diff: 'diff_electricity_day',
  },
  night: {
    current: 'electricity_night',
    prev: 'prev_electricity_night',
    baseline: 'electricity_baseline_night',
    oldFinal: 'electricity_old_final_night',
    diff: 'diff_electricity_night',
  },
};

function diffElectricity(
  reading: ReadingDbRow,
  kind: 'single' | 'day' | 'night',
): number {
  const k = ELECTRICITY_KEYS[kind];
  const current = reading[k.current] as number | null;
  const hasReplacement = reading[k.baseline] != null || reading[k.oldFinal] != null;
  return hasReplacement
    ? effectiveDiff(
        current,
        (reading[k.prev] as number | null) ?? null,
        (reading[k.baseline] as number | null | undefined) ?? null,
        (reading[k.oldFinal] as number | null | undefined) ?? null,
      )
    : Math.max((reading[k.diff] as number | null | undefined) ?? 0, 0);
}

/** UA: Обчислює diff для одного запису (з урахуванням заміни лічильника). EN: Computes diff for one reading (meter replacement aware). */
function computeDiffForReading(reading: ReadingDbRow): DiffForTotal {
  return {
    water: diffOne(reading, 'water', 'diff_water', 'prev_water', 'water_baseline', 'water_old_final'),
    gas: diffOne(reading, 'gas', 'diff_gas', 'prev_gas', 'gas_baseline', 'gas_old_final'),
    electricity_single: diffElectricity(reading, 'single'),
    electricity_day: diffElectricity(reading, 'day'),
    electricity_night: diffElectricity(reading, 'night'),
  };
}

function setElectricityReplacement(
  payload: ReadingsDbRow,
  e: NonNullable<MonthSchema['replacement']>['electricity'],
): void {
  if (!e) return;
  if (e.baselineSingle != null) payload.electricity_baseline_single = e.baselineSingle;
  if (e.baselineDay != null) payload.electricity_baseline_day = e.baselineDay;
  if (e.baselineNight != null) payload.electricity_baseline_night = e.baselineNight;
  if (e.oldFinalSingle != null) payload.electricity_old_final_single = e.oldFinalSingle;
  if (e.oldFinalDay != null) payload.electricity_old_final_day = e.oldFinalDay;
  if (e.oldFinalNight != null) payload.electricity_old_final_night = e.oldFinalNight;
}

/** UA: Заповнює payload полями заміни з data.replacement. EN: Fills payload with replacement fields from data.replacement. */
function applyReplacementToPayload(
  payload: ReadingsDbRow,
  replacement: NonNullable<MonthSchema['replacement']>,
): void {
  setElectricityReplacement(payload, replacement.electricity);
  if (replacement.water?.baseline != null) payload.water_baseline = replacement.water.baseline;
  if (replacement.water?.oldFinal != null) payload.water_old_final = replacement.water.oldFinal;
  if (replacement.gas?.baseline != null) payload.gas_baseline = replacement.gas.baseline;
  if (replacement.gas?.oldFinal != null) payload.gas_old_final = replacement.gas.oldFinal;
}

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

  if (data.replacement) {
    applyReplacementToPayload(payload, data.replacement);
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
  const diff = computeDiffForReading(reading);
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
