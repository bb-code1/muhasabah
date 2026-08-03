export const ISLAMIC_MONTHS = [
  'Muharram',
  'Safar',
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  'Jumada al-Awwal',
  'Jumada al-Thani',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhu al-Qi'dah",
  'Dhu al-Hijjah'
];

export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

export function getHijriMonthNumber(
  date: Date = new Date(),
  offsetDays: number = 0,
  timeZone: string = DEFAULT_TIMEZONE
): number {
  const adjustedTime = date.getTime() + offsetDays * 24 * 60 * 60 * 1000;
  const adjustedDate = new Date(adjustedTime);
  try {
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      timeZone,
      month: 'numeric'
    });
    const parts = formatter.formatToParts(adjustedDate);
    const monthVal = parts.find(p => p.type === 'month')?.value;
    if (monthVal) {
      const monthNum = parseInt(monthVal, 10);
      if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
        return monthNum;
      }
    }
  } catch (e) {
    console.error('Failed to get Hijri month number', e);
  }
  return 1;
}

export function getHijriDateString(
  date: Date = new Date(),
  offsetDays: number = 0,
  timeZone: string = DEFAULT_TIMEZONE
): string {
  // Apply manual offset (convert offset in days to milliseconds)
  const adjustedTime = date.getTime() + offsetDays * 24 * 60 * 60 * 1000;
  const adjustedDate = new Date(adjustedTime);

  try {
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      timeZone,
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });

    const parts = formatter.formatToParts(adjustedDate);
    const day = parts.find(p => p.type === 'day')?.value;
    const monthVal = parts.find(p => p.type === 'month')?.value;
    const year = parts.find(p => p.type === 'year')?.value;
    const era = parts.find(p => p.type === 'era')?.value || 'AH';

    let monthName = monthVal || '';
    if (monthVal) {
      const monthNum = parseInt(monthVal, 10);
      if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
        monthName = ISLAMIC_MONTHS[monthNum - 1];
      }
    }

    return `${day} ${monthName} ${year} ${era}`;
  } catch (e) {
    console.error('Failed to format Hijri date using Intl', e);
    // Fallback to local date string
    return adjustedDate.toLocaleDateString();
  }
}

