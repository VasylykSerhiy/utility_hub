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
export const formatDate = 'dd.MM.yyyy';
