import {
  differenceInDays,
  differenceInMinutes,
  format,
  formatDistanceToNow,
  isToday,
  isTomorrow,
  isValid,
  isYesterday,
  set,
} from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const DEFAULT_FALLBACK = 'N/A';
const DEFAULT_SEPARATOR = ' - ';
const TIME_REGEX = /^(\d{1,2}):(\d{2})(:\d{2})?$/;

export const DATE_FORMATS = {
  default: 'dd.MM.yyyy',
  noYear: 'dd MMM',
  withTime: 'dd MMM yyyy, HH:mm',
  withTimeAMPM: 'dd MMM yyyy, hh:mm a',
  short: 'dd.MM.yy',
  onlyTime: 'HH:mm',
  onlyTimeAMPM: 'hh:mm a',
  iso: 'yyyy-MM-dd',
  notFormat: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;

export type DateFormatType = keyof typeof DATE_FORMATS;
export type DateInput = number | string | Date | undefined | null;

export interface FormatDateOptions {
  date: DateInput | [DateInput, DateInput];
  variant?: DateFormatType;
  customFormat?: string;
  fallback?: string;
  relative?: boolean;
  relativeThreshold?: number;
  smartYear?: boolean;
  separator?: string;
  /** * Якщо true, дата буде відображена в UTC, ігноруючи локальний зсув.
   * If true, the date will be displayed in UTC, ignoring the local offset.
   */
  ignoreTimezone?: boolean;
}

const parseDateInput = (date: DateInput, now: Date): Date | null => {
  if (date === null || date === undefined || date === '') return null;

  if (typeof date === 'string' && TIME_REGEX.test(date)) {
    const [hours, minutes] = date.split(':').map(Number);
    return set(now, { hours, minutes, seconds: 0, milliseconds: 0 });
  }

  const parsed = date instanceof Date ? date : new Date(date);
  return isValid(parsed) ? parsed : null;
};

/**
 * Обертка для форматування, яка обирає між локальним часом та UTC.
 * Formatting wrapper that chooses between local time and UTC.
 */
const formatWrapper = (
  date: Date,
  formatStr: string,
  ignoreTimezone: boolean,
): string => {
  return ignoreTimezone
    ? formatInTimeZone(date, 'UTC', formatStr)
    : format(date, formatStr);
};

const getRelativeTimeString = (
  parsedDate: Date,
  now: Date,
  threshold: number,
): string | null => {
  const diffInMinutes = Math.abs(differenceInMinutes(now, parsedDate));
  const diffInDays = Math.abs(differenceInDays(now, parsedDate));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInDays > threshold) return null;

  if (isToday(parsedDate))
    return `Today, ${format(parsedDate, DATE_FORMATS.onlyTime)}`;
  if (isYesterday(parsedDate))
    return `Yesterday, ${format(parsedDate, DATE_FORMATS.onlyTime)}`;
  if (isTomorrow(parsedDate))
    return `Tomorrow, ${format(parsedDate, DATE_FORMATS.onlyTime)}`;

  return formatDistanceToNow(parsedDate, { addSuffix: true });
};

function handleRangeFormatting(
  [start, end]: [DateInput, DateInput],
  options: FormatDateOptions,
  now: Date,
): string {
  const {
    fallback = DEFAULT_FALLBACK,
    separator = DEFAULT_SEPARATOR,
    variant = 'default',
    customFormat,
    ignoreTimezone = false,
  } = options;

  const d1 = parseDateInput(start, now);
  const d2 = parseDateInput(end, now);

  if (!d1 && !d2) return fallback;
  if (!d1) return formatDateInternal({ ...options, date: end }, now);
  if (!d2) return formatDateInternal({ ...options, date: start }, now);

  const [first, second] = d1 > d2 ? [d2, d1] : [d1, d2];

  if (variant === 'default' && !customFormat) {
    // Перевірка на однаковий місяць/рік через обертку (локально або UTC)
    // Checking for same month/year via wrapper (local or UTC)
    const fMonth = formatWrapper(first, 'yyyy-MM', ignoreTimezone);
    const sMonth = formatWrapper(second, 'yyyy-MM', ignoreTimezone);
    const fYear = formatWrapper(first, 'yyyy', ignoreTimezone);
    const sYear = formatWrapper(second, 'yyyy', ignoreTimezone);

    if (fMonth === sMonth) {
      return `${formatWrapper(first, 'dd', ignoreTimezone)}${separator}${formatDateInternal({ ...options, date: second }, now)}`;
    }
    if (fYear === sYear) {
      return `${formatWrapper(first, 'dd MMM', ignoreTimezone)}${separator}${formatDateInternal({ ...options, date: second }, now)}`;
    }
  }

  return `${formatDateInternal({ ...options, date: first }, now)}${separator}${formatDateInternal({ ...options, date: second }, now)}`;
}

function formatDateInternal(options: FormatDateOptions, now: Date): string {
  const {
    date,
    variant = 'default',
    customFormat,
    fallback = DEFAULT_FALLBACK,
    relative = false,
    relativeThreshold = 7,
    smartYear = false,
    ignoreTimezone = false,
  } = options;

  if (Array.isArray(date)) {
    return handleRangeFormatting(date, options, now);
  }

  const parsedDate = parseDateInput(date, now);
  if (!parsedDate) return fallback;

  // Відносний час зазвичай працює в локальному контексті
  // Relative time usually works in local context
  if (relative && !ignoreTimezone) {
    const relativeStr = getRelativeTimeString(
      parsedDate,
      now,
      relativeThreshold,
    );
    if (relativeStr) return relativeStr;
  }

  let effectiveVariant = variant;
  if (
    typeof date === 'string' &&
    TIME_REGEX.test(date) &&
    variant === 'default'
  ) {
    effectiveVariant = 'onlyTimeAMPM';
  }

  let formatStr = customFormat || DATE_FORMATS[effectiveVariant];

  if (smartYear && !customFormat && effectiveVariant === 'default') {
    const pYear = formatWrapper(parsedDate, 'yyyy', ignoreTimezone);
    const nYear = formatWrapper(now, 'yyyy', ignoreTimezone);
    if (pYear === nYear) formatStr = DATE_FORMATS.noYear;
  }

  return formatWrapper(parsedDate, formatStr, ignoreTimezone);
}

export const formatDate = (options: FormatDateOptions): string => {
  return formatDateInternal(options, new Date());
};
