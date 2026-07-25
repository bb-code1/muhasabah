export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

/**
 * Returns the local YYYY-MM-DD date string for a given date in the specified timezone.
 * Defaults to Asia/Kolkata (GMT+5:30).
 */
export function getLocalDateString(
  dateInput: Date | string | number = new Date(),
  timeZone: string = DEFAULT_TIMEZONE
): string {
  const date = typeof dateInput === 'string' || typeof dateInput === 'number'
    ? new Date(dateInput)
    : dateInput;

  // Use Intl.DateTimeFormat with en-CA locale which natively outputs YYYY-MM-DD
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return formatter.format(date);
}

/**
 * Returns the current date in YYYY-MM-DD format for the specified timezone.
 * Defaults to Asia/Kolkata (GMT+5:30).
 */
export function getTodayDateString(timeZone: string = DEFAULT_TIMEZONE): string {
  return getLocalDateString(new Date(), timeZone);
}

/**
 * Parses a YYYY-MM-DD string into a UTC midnight Date object for Prisma queries on @db.Date fields.
 */
export function parseLocalDate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

/**
 * Formats a date string (YYYY-MM-DD) or Date object for UI display without timezone shifting issues.
 */
export function formatDateForDisplay(
  dateInput: Date | string,
  options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  timeZone: string = DEFAULT_TIMEZONE
): string {
  let date: Date;
  let tz = timeZone;

  if (typeof dateInput === 'string') {
    if (dateInput.length === 10) {
      date = new Date(`${dateInput}T00:00:00.000Z`);
      tz = 'UTC';
    } else {
      date = new Date(dateInput);
    }
  } else {
    date = dateInput;
  }

  return new Intl.DateTimeFormat('en-US', { ...options, timeZone: tz }).format(date);
}
