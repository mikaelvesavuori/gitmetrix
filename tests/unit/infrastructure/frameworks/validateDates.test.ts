import test from 'ava';

import { validateDates } from '../../../../src/infrastructure/frameworks/validateDates';

test.serial('It should validate an 8-digit "from" date', (t) => {
  const expected = true;
  const response = validateDates('20201030');
  t.deepEqual(response, expected);
});

test.serial('It should validate 8-digit "from" and "to" dates', (t) => {
  const expected = true;
  const response = validateDates('20201030', '20221231');
  t.deepEqual(response, expected);
});

/**
 * NEGATIVE TESTS
 */

test.serial('It should not validate a "from" date that is more recent than the "to" date', (t) => {
  const expected = false;
  const response = validateDates('20221231', '20201030');
  t.deepEqual(response, expected);
});

test.serial('It should not validate a "from" date that is less than 8 digits', (t) => {
  const expected = false;
  const response = validateDates('2020103');
  t.deepEqual(response, expected);
});

test.serial('It should not validate a "to" date that is less than 8 digits', (t) => {
  const expected = false;
  const response = validateDates('20201030', '2020103');
  t.deepEqual(response, expected);
});

test.serial('It should not validate a date that is more than 8 digits', (t) => {
  const expected = false;
  const response = validateDates('2020103000');
  t.deepEqual(response, expected);
});

test.serial('It should not validate a "from" date that includes letters', (t) => {
  const expected = false;
  const response = validateDates('2020103x');
  t.deepEqual(response, expected);
});

test.serial('It should not validate a "to" date that includes letters', (t) => {
  const expected = false;
  const response = validateDates('20201030', '2020103x');
  t.deepEqual(response, expected);
});
