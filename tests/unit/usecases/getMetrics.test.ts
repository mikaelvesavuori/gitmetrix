import { test, expect } from 'vitest';

import { getMetrics } from '../../../src/usecases/getMetrics';

import { getRepo } from '../../../src/infrastructure/frameworks/getRepo';

import metricsResultsFresh from '../../../testdata/expectations/metrics-results-fresh.json';
import { testCachedMetrics } from '../../../testdata/database/LocalTestDatabase';

test('It should get metrics', async () => {
  const expected: any = metricsResultsFresh;

  const repository = getRepo(true);
  const response = await getMetrics(repository, {
    repo: 'SOMEORG/SOMEREPO',
    from: '1665360000000',
    to: '1667174399000',
    offset: 0
  });

  expect(response).toMatchObject(expected);
});

test('It should get cached metrics', async () => {
  const expected: any = testCachedMetrics;

  const repository = getRepo(true);
  const response = await getMetrics(repository, {
    repo: 'SOMEORG/SOMEREPO',
    from: '1642636800000',
    to: '1643587199000',
    offset: 0
  });

  expect(response).toMatchObject(expected);
});
