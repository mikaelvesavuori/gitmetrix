import { test, expect } from 'vitest';
import { getDateYesterday, getTimestampsForPeriod } from 'chrono-utils';

import { getRequestDTO } from '../../../src/application/getRequestDTO';
import {
  InvalidOffsetError,
  MissingRepoNameError,
  MissingRequiredInputParamsError,
  OutOfRangeQueryError,
  TooManyInputParamsError
} from '../../../src/application/errors/errors';

const getRandomInteger = () => Math.floor(Math.random() * 15) + 1;

test('It should create a request DTO for a set period', () => {
  const offset = 0;
  const expected = { repo: 'SOMEORG/SOMEREPO', from: '1669852800', to: '1672531199', offset };

  const result = getRequestDTO({
    from: '20221201',
    to: '20221231',
    offset,
    repo: 'SOMEORG/SOMEREPO'
  });

  expect(result).toMatchObject(expected);
});

test('It should create a request DTO for a set period with a negative offset', () => {
  const offset = -5;
  const expected = { repo: 'SOMEORG/SOMEREPO', from: '1669834800', to: '1672513199', offset };

  const result = getRequestDTO({
    from: '20221201',
    to: '20221231',
    offset,
    repo: 'SOMEORG/SOMEREPO'
  });

  expect(result).toMatchObject(expected);
});

test('It should create a request DTO for a set period with a positive offset', () => {
  const offset = 5;
  const expected = { repo: 'SOMEORG/SOMEREPO', from: '1669870800', to: '1672549199', offset };

  const result = getRequestDTO({
    from: '20221201',
    to: '20221231',
    offset,
    repo: 'SOMEORG/SOMEREPO'
  });

  expect(result).toMatchObject(expected);
});

test('It should create a request DTO for a dynamic period', () => {
  const days = getRandomInteger();
  const { from, to } = getTimestampsForPeriod(days);
  const expected = { repo: 'SOMEORG/SOMEREPO', from, to, offset: 0 };

  const result = getRequestDTO({
    last: `${days}`,
    repo: 'SOMEORG/SOMEREPO'
  });

  expect(result).toMatchObject(expected);
});

test('It should create a request DTO for a dynamic period with a negative offset', () => {
  const days = getRandomInteger();
  const offset = -5;
  const { from, to } = getTimestampsForPeriod(days, offset);
  const expected = { repo: 'SOMEORG/SOMEREPO', from, to, offset };

  const result = getRequestDTO({
    last: `${days}`,
    offset: `${offset}`,
    repo: 'SOMEORG/SOMEREPO'
  });

  expect(result).toMatchObject(expected);
});

test('It should create a request DTO for a dynamic period with a positive offset', () => {
  const days = getRandomInteger();
  const offset = 5;
  const { from, to } = getTimestampsForPeriod(days, offset);
  const expected = { repo: 'SOMEORG/SOMEREPO', from, to, offset };

  const result = getRequestDTO({
    last: `${days}`,
    offset: `${offset}`,
    repo: 'SOMEORG/SOMEREPO'
  });

  expect(result).toMatchObject(expected);
});

/**
 * NEGATIVE TESTS
 */

test('It should throw a MissingRepoNameError error if no repo name is present', () => {
  expect(() =>
    getRequestDTO({
      from: '20221201',
      to: '20221231'
    })
  ).toThrowError(MissingRepoNameError);
});

test('It should throw a MissingRequiredInputParamsError error if no "to" date is present', () => {
  expect(() =>
    getRequestDTO({
      repo: 'SOMEORG/SOMEREPO',
      from: '20221201'
    })
  ).toThrowError(MissingRequiredInputParamsError);
});

test('It should throw a MissingRequiredInputParamsError error if no "from" date is present', () => {
  expect(() =>
    getRequestDTO({
      repo: 'SOMEORG/SOMEREPO',
      from: '20221201'
    })
  ).toThrowError(MissingRequiredInputParamsError);
});

test('It should throw a OutOfRangeQueryError error if the "to" date is beyond the maximum date range', () => {
  expect(() =>
    getRequestDTO({
      repo: 'SOMEORG/SOMEREPO',
      from: '20221201',
      to: '20991231'
    })
  ).toThrowError(OutOfRangeQueryError);
});

test('It should throw a OutOfRangeQueryError error if the "from" date is beyond the maximum date range', () => {
  expect(() =>
    getRequestDTO({
      repo: 'SOMEORG/SOMEREPO',
      from: '19000101',
      to: getDateYesterday(true)
    })
  ).toThrowError(OutOfRangeQueryError);
});

test('It should throw a TooManyInputParamsError error if using both "from" + "to" and "last" parameters', () => {
  expect(() =>
    getRequestDTO({
      repo: 'SOMEORG/SOMEREPO',
      from: '20221201',
      to: '20221231',
      last: '7'
    })
  ).toThrowError(TooManyInputParamsError);
});

test('It should throw an InvalidOffsetError if offset is too small (negative)', () => {
  expect(() =>
    getRequestDTO({
      repo: 'SOMEORG/SOMEREPO',
      from: '20221201',
      to: '20221231',
      offset: -13
    })
  ).toThrowError(InvalidOffsetError);
});

test('It should throw an InvalidOffsetError if offset is too big (positive)', () => {
  expect(() =>
    getRequestDTO({
      repo: 'SOMEORG/SOMEREPO',
      from: '20221201',
      to: '20221231',
      offset: 13
    })
  ).toThrowError(InvalidOffsetError);
});
