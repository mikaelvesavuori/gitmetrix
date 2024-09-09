import { test, expect } from 'vitest';

import { createNewLocalRepository } from '../../../../src/infrastructure/repositories/LocalRepository';

import { testCachedMetrics } from '../../../../testdata/database/LocalTestDatabase';
import metricsStoredLocal from '../../../../testdata/expectations/metrics-stored-local.json';

test('It should get metrics for all dates between a supplied "fromDate" and "toDate"', async () => {
  const expected = metricsStoredLocal;

  const repo = createNewLocalRepository();

  const response = await repo.getMetrics({
    key: 'SOMEORG/SOMEREPO',
    from: '1666224000000',
    to: '1672444799000'
  });

  expect(response).toMatchObject(expected);
});

test('It should get an empty array if no match is found for fresh metrics', async () => {
  const expected: any = [];

  const repo = createNewLocalRepository();

  const response = await repo.getMetrics({
    key: 'asdf',
    from: '1672531200000',
    to: '1672703999000'
  });

  expect(response).toMatchObject(expected);
});

test('It should get cached metrics for all dates between a supplied "fromDate" and "toDate"', async () => {
  const expected = testCachedMetrics;

  const repo = createNewLocalRepository();

  const response = await repo.getCachedMetrics({
    key: 'SOMEORG/SOMEREPO',
    from: '1642636800000',
    to: '1643500800000'
  });

  expect(response).toMatchObject(expected);
});

test('It should get an empty object if no match is found for cached metrics', async () => {
  const expected: Record<string, any> = {};

  const repo = createNewLocalRepository();

  const response = await repo.getCachedMetrics({
    key: 'asdf',
    from: '1672531200000',
    to: '1672703999000'
  });

  expect(response).toMatchObject(expected);
});
