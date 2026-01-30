import {
  differenceInDays,
  differenceInMinutes,
  format,
  formatDistanceToNow,
  isToday,
  isTomorrow,
  isValid,
  isYesterday,
  type Locale,
  set,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';

const DEFAULT_FALLBACK = 'N/A';
const DEFAULT_SEPARATOR = ' - ';
const TIME_REGEX = /^(\d{1,2}):(\d{2})(:\d{2})?$/;

interface RelativeLabels {
  today: string;
  yesterday: string;
  tomorrow: string;
  now: string;
}

const RELATIVE_LABELS: Record<string, RelativeLabels> = {
  uk: {
    today: 'Сьогодні',
    yesterday: 'Вчора',
    tomorrow: 'Завтра',
    now: 'Щойно',
  },
  'en-US': {
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    now: 'Just now',
  },
};

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
  ignoreTimezone?: boolean;
  locale?: Locale;
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

const formatWrapper = (
  date: Date,
  formatStr: string,
  options: Pick<FormatDateOptions, 'ignoreTimezone' | 'locale'>,
): string => {
  const { ignoreTimezone, locale } = options;
  return ignoreTimezone
    ? formatInTimeZone(date, 'UTC', formatStr, { locale })
    : format(date, formatStr, { locale });
};

const getRelativeTimeString = (
  parsedDate: Date,
  now: Date,
  threshold: number,
  locale: Locale = enUS,
): string | null => {
  const diffInMinutes = Math.abs(differenceInMinutes(now, parsedDate));
  const diffInDays = Math.abs(differenceInDays(now, parsedDate));

  const localeKey = locale.code || 'en-US';
  const labels = RELATIVE_LABELS[localeKey] ?? RELATIVE_LABELS['en-US'];

  if (!labels) {
    return null;
  }

  if (diffInMinutes < 1) return labels.now;
  if (diffInDays > threshold) return null;

  const timeStr = format(parsedDate, DATE_FORMATS.onlyTime, { locale });

  if (isToday(parsedDate)) return `${labels.today}, ${timeStr}`;
  if (isYesterday(parsedDate)) return `${labels.yesterday}, ${timeStr}`;
  if (isTomorrow(parsedDate)) return `${labels.tomorrow}, ${timeStr}`;

  return formatDistanceToNow(parsedDate, { addSuffix: true, locale });
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
    locale,
  } = options;

  const d1 = parseDateInput(start, now);
  const d2 = parseDateInput(end, now);

  if (!d1 && !d2) return fallback;
  if (!d1) return formatDateInternal({ ...options, date: end }, now);
  if (!d2) return formatDateInternal({ ...options, date: start }, now);

  const [first, second] = d1 > d2 ? [d2, d1] : [d1, d2];

  if (variant === 'default' && !customFormat) {
    const fMonth = formatWrapper(first, 'yyyy-MM', { ignoreTimezone, locale });
    const sMonth = formatWrapper(second, 'yyyy-MM', { ignoreTimezone, locale });
    const fYear = formatWrapper(first, 'yyyy', { ignoreTimezone, locale });
    const sYear = formatWrapper(second, 'yyyy', { ignoreTimezone, locale });

    if (fMonth === sMonth) {
      const day = formatWrapper(first, 'dd', { ignoreTimezone, locale });
      return `${day}${separator}${formatDateInternal({ ...options, date: second }, now)}`;
    }
    if (fYear === sYear) {
      const dayMonth = formatWrapper(first, 'dd MMM', {
        ignoreTimezone,
        locale,
      });
      return `${dayMonth}${separator}${formatDateInternal({ ...options, date: second }, now)}`;
    }
  }

  const part1 = formatDateInternal({ ...options, date: first }, now);
  const part2 = formatDateInternal({ ...options, date: second }, now);
  return `${part1}${separator}${part2}`;
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
    locale = enUS,
  } = options;

  if (Array.isArray(date)) {
    return handleRangeFormatting(date, options, now);
  }

  const parsedDate = parseDateInput(date, now);
  if (!parsedDate) return fallback;

  if (relative && !ignoreTimezone) {
    const relativeStr = getRelativeTimeString(
      parsedDate,
      now,
      relativeThreshold,
      locale,
    );
    if (relativeStr !== null) return relativeStr;
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
    const pYear = formatWrapper(parsedDate, 'yyyy', { ignoreTimezone, locale });
    const nYear = formatWrapper(now, 'yyyy', { ignoreTimezone, locale });
    if (pYear === nYear) formatStr = DATE_FORMATS.noYear;
  }

  return formatWrapper(parsedDate, formatStr, { ignoreTimezone, locale });
}

export const formatDate = (options: FormatDateOptions): string => {
  return formatDateInternal(options, new Date());
};
