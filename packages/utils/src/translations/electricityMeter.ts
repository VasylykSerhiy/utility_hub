import i18n from '@workspace/i18n/i18n';
import { ElectricityMeterType } from '@workspace/types';

export function getElectricityMeterLabel(type: ElectricityMeterType) {
  switch (type) {
    case ElectricityMeterType.SINGLE:
      return i18n.t('ELECTRICITY.SINGLE');
    case ElectricityMeterType.DOUBLE:
      return i18n.t('ELECTRICITY.DOUBLE');
    default:
      return type;
  }
}
