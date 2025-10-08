import { ElectricityMeters } from '@workspace/utils';

export const calcElectricity = (
  current: ElectricityMeters,
  prev?: ElectricityMeters,
): ElectricityMeters => {
  if (current.type === 'single') {
    const prevSingle = prev?.type === 'single' ? prev.single : 0;
    return { type: 'single', single: (current.single ?? 0) - prevSingle };
  } else {
    const prevDay = prev?.type === 'double' ? prev.day : 0;
    const prevNight = prev?.type === 'double' ? prev.night : 0;
    return {
      type: 'double',
      day: (current.day ?? 0) - prevDay,
      night: (current.night ?? 0) - prevNight,
    };
  }
};

export const calcTotalElectricity = (
  diff: ElectricityMeters,
  tariff?: ElectricityMeters,
) => {
  const t =
    tariff ??
    (diff.type === 'single'
      ? { type: 'single', single: 0 }
      : { type: 'double', day: 0, night: 0 });

  if (diff.type === 'single') {
    return (diff.single ?? 0) * (t.type === 'single' ? t.single : 0);
  } else {
    return (
      (diff.day ?? 0) * (t.type === 'double' ? t.day : 0) +
      (diff.night ?? 0) * (t.type === 'double' ? t.night : 0)
    );
  }
};
