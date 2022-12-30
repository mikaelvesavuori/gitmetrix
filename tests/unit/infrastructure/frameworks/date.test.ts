import test from 'ava';

import {
  getFirstDateInCurrentMonth,
  getLastDateInCurrentMonth,
  getCurrentDate,
  getDateBefore,
  makeTwoDigitDay,
  datesWithinMaximumRange
} from '../../../../src/infrastructure/frameworks/date';

// Shared setup
const date = new Date();
const month = date.getMonth() + 1;
const year = date.getFullYear();
const day = date.getDate();
const lastDay = new Date(year, month).toISOString().split('T')[0].substring(8);

test.serial('It should get the first date in the current month in `YYYY-MM-DD` format', (t) => {
  const expected = `${year}-${month}-01`;

  const response = getFirstDateInCurrentMonth();

  t.deepEqual(response, expected);
});

test.serial('It should get the last date in the current month in `YYYY-MM-DD` format', (t) => {
  const expected = `${year}-${month}-${lastDay}`;

  const response = getLastDateInCurrentMonth();

  t.deepEqual(response, expected);
});

test.serial('It should get the current date in `YYYY-MM-DD` format', (t) => {
  const expected = `${year}-${month}-${day}`;

  const response = getCurrentDate();

  t.deepEqual(response, expected);
});

test.serial('It should add a leading 0 if day value is below 10', (t) => {
  const expected = '05';

  const response = makeTwoDigitDay(new Date('2022-12-05'));

  t.deepEqual(response, expected);
});

test.serial('It should get the date of the day before today in `YYYY-MM-DD` format', (t) => {
  const today = new Date(getCurrentDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const expected = yesterday.toISOString().split('T')[0];

  const response = getDateBefore();

  t.deepEqual(response, expected);
});

test.serial('It should get the date of the day before today in `YYYYMMDD` format', (t) => {
  const today = new Date(getCurrentDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const expected = yesterday.toISOString().split('T')[0].replaceAll('-', '');

  const response = getDateBefore(true);

  t.deepEqual(response, expected);
});

test.serial('It should return "true" for two dates within an accepted time span', (t) => {
  const expected = true;

  const startDate = new Date('2022-11-30');
  const endDate = new Date('2022-12-01');
  const response = datesWithinMaximumRange(startDate, endDate);

  t.is(response, expected);
});

test.serial('It should return "false" for two dates outside of an accepted time span', (t) => {
  const expected = false;

  const startDate = new Date('2018-06-01');
  const endDate = new Date('2021-12-01');
  const response = datesWithinMaximumRange(startDate, endDate);

  t.is(response, expected);
});

test.serial(
  'It should return "false" for two dates outside of an accepted, customized time span',
  (t) => {
    const expected = false;

    const startDate = new Date('2022-12-01');
    const endDate = new Date('2022-12-10');
    const response = datesWithinMaximumRange(startDate, endDate, 7);

    t.is(response, expected);
  }
);

test.serial(
  'It should throw a InvalidDateOrderError if the start date is after the end date',
  (t) => {
    const expected = 'InvalidDateOrderError';

    const startDate = new Date('2022-12-02');
    const endDate = new Date('2022-12-01');

    const error: any = t.throws(() => datesWithinMaximumRange(startDate, endDate));

    t.is(error.name, expected);
  }
);
