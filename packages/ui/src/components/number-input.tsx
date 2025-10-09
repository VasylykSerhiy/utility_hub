import React from 'react';

import { NumericFormat, NumericFormatProps } from 'react-number-format';

import { Input } from '@workspace/ui/components/input';
import { cn } from '@workspace/ui/lib/utils';

const NumberInput = ({ className, ...rest }: NumericFormatProps) => {
  return (
    <NumericFormat
      customInput={Input}
      thousandSeparator
      allowNegative={false}
      placeholder='0.00'
      className={cn('pr-20', className)}
      {...rest}
    />
  );
};

export default NumberInput;
