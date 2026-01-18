import * as React from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { Language } from '@workspace/types';
import { formatDate, localeDateMap } from '@workspace/utils';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { Calendar } from '@workspace/ui/components/calendar';
import { cn } from '@workspace/ui/lib/utils';

interface IDatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
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
              <CalendarIcon />
              {date ? (
                formatDate({
                  date,
                  ...(language && { locale: localeDateMap[language] }),
                })
              ) : (
                <span>{placeholder ?? 'Pick a date'}</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            locale={localeDateMap[language]}
            mode={'single'}
            selected={date}
            onSelect={setDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
