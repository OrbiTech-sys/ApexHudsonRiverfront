/** Date helpers that work on local calendar dates stored as YYYY-MM-DD. */

const pad = (value: number) => String(value).padStart(2, "0");

export function toIso(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromIso(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** Same day-of-month `months` later, clamped to the end of shorter months. */
export function addMonths(date: Date, months: number, day = date.getDate()): Date {
  const first = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  return new Date(first.getFullYear(), first.getMonth(), Math.min(day, lastDay));
}

export function daysBetween(fromDate: Date, toDate: Date): number {
  const ms = 24 * 60 * 60 * 1000;
  const a = Date.UTC(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const b = Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  return Math.round((b - a) / ms);
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const monthFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

export function formatIsoDate(iso: string): string {
  return dateFormat.format(fromIso(iso));
}

export function formatMonth(date: Date): string {
  return monthFormat.format(date);
}

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return `${dateFormat.format(date)}, ${timeFormat.format(date)}`;
}
