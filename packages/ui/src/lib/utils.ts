import { Language } from '@workspace/types';
import { type ClassValue, clsx } from 'clsx';
import { Locale, enUS, uk } from 'react-day-picker/locale';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const localeCalendar: { [k in Language]: Locale } = {
  uk,
  en: enUS,
};
