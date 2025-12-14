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

export const mapTariffToFrontend = (tariff: any) => ({
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

export const calculateTotal = (diff: any, tariff: any) => {
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

export const mapReadingToFrontend = (
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

export const mapPropertyToFrontend = (
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
