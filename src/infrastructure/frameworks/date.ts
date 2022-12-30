import { zuluToUnix } from './time';

import { InvalidDateOrderError } from '../../application/errors';

/**
 * @description Returns the first date in the current month in `YYYY-MM-DD` format.
 * @example `2022-11-20`
 */
export function getFirstDateInCurrentMonth(): string {
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}-${month}-01`;
}

/**
 * @description Return the last date in the current month in `YYYY-MM-DD` format.
 * @example `2022-11-20`
 */
export function getLastDateInCurrentMonth(): string {
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const day = new Date(year, month).toISOString().split('T')[0].substring(8);

  return `${year}-${month}-${day}`;
}

/**
 * @description Returns the current date in `YYYY-MM-DD` format.
 *
 * The `noDashes` option will strip any dashes between days, months, etc.
 *
 * @example `2022-11-20`
 * @example `20221120`
 */
export function getCurrentDate(noDashes = false): string {
  const date = new Date();
  const day = makeTwoDigitDay(date);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const dateString = `${year}-${month}-${day}`;

  if (noDashes) return dateString.replaceAll('-', '');
  return dateString;
}

/**
 * @description Add leading zero if day is under 10.
 */
export function makeTwoDigitDay(date: Date): string {
  const day = date.getDate().toString();
  return day.length === 1 ? `0${day}` : day;
}

/**
 * @description Return the date of the day before today in `YYYY-MM-DD` format.
 *
 * The `noDashes` option will strip any dashes between days, months, etc.
 *
 * @example `2022-11-20`
 * @example `20221120`
 */
export function getDateBefore(noDashes = false): string {
  const today = new Date(getCurrentDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const dateString = yesterday.toISOString().split('T')[0];

  if (noDashes) return dateString.replaceAll('-', '');
  return dateString;
}

/**
 * @description Checks if two date objects are within a accepted maximum day range.
 */
export function datesWithinMaximumRange(startDate: Date, endDate: Date, maxDays = 365) {
  const start = zuluToUnix(startDate.toISOString());
  const end = zuluToUnix(endDate.toISOString());
  if (start > end) throw new InvalidDateOrderError();

  // Divide by milliseconds and then by number of seconds in a day
  return Math.round((end - start) / 1000 / 86400) <= maxDays;
}
