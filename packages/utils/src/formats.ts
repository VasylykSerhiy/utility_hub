import i18n from '@workspace/i18n/i18n';
import { Language } from '@workspace/types';
import { Locale, enUS, uk } from 'date-fns/locale';
import { numericFormatter as _numericFormatter } from 'react-number-format';
import { NumericFormatProps } from 'react-number-format/types/types';

export const localeDateMap: { [k in Language]: Locale } = {
  uk,
  en: enUS,
};

export const numericFormatter = (
  num: number | string | undefined,
  props?: NumericFormatProps,
) => {
  return _numericFormatter(String(num ?? 0), {
    thousandSeparator: ',',
    decimalScale: 2,
    ...props,
  });
};

export const formatEnergy = (num: number | string | undefined) => {
  return numericFormatter(num, { suffix: ` ${i18n.t('KWN')}` });
};

export const formatVolume = (num: number | string | undefined) => {
  return numericFormatter(num, { suffix: ` ${i18n.t('M3')}` });
};

export const formatCurrencySymbol = (num: number | string | undefined) => {
  return numericFormatter(num, { suffix: ` ${i18n.t('₴')}` });
};

export const formatDate = 'dd.MM.yyyy';
