import i18n from '@workspace/i18n/i18n';
import { IElectricityType } from '@workspace/types';

export function getElectricityMeterLabel(type: IElectricityType) {
  switch (type) {
    case IElectricityType.SINGLE:
      return i18n.t('ELECTRICITY.SINGLE');
    case IElectricityType.DOUBLE:
      return i18n.t('ELECTRICITY.DOUBLE');
    default:
      return type;
  }
}
