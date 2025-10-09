import { numericFormatter as _numericFormatter } from 'react-number-format';
import { NumericFormatProps } from 'react-number-format/types/types';

export const numericFormatter = (
  num: number | string,
  props?: NumericFormatProps,
) =>
  _numericFormatter(String(num), {
    thousandSeparator: ',',
    decimalScale: 2,
    ...props,
  });

export const formatDate = 'dd.MM.yyyy';
