'use client';

import * as React from 'react';

import type { Language } from '@workspace/types';
import { Button } from '@workspace/ui/components/button';
import { Calendar } from '@workspace/ui/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover';
import { cn } from '@workspace/ui/lib/utils';
import { formatDate, localeDateMap } from '@workspace/utils';
import { CalendarIcon } from 'lucide-react';

interface IDatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
  language: Language;
}

export function DatePicker({
  className,
  date,
  setDate,
  placeholder,
  language,
}: IDatePickerWithRangeProps) {
  const currentLocale = React.useMemo(() => localeDateMap[language], [language]);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant='secondary'
            className={cn('relative justify-between text-left font-normal')}
          >
            <span className='flex items-center gap-2'>
              <CalendarIcon className='h-4 w-4' />
              {date ? (
                formatDate({
                  date,
                  ...(language && { locale: currentLocale }),
                })
              ) : (
                <span>{placeholder ?? 'Pick a date'}</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            locale={currentLocale}
            mode='single'
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
