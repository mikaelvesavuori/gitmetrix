import test from 'ava';

import { getMetrics } from '../../../src/usecases/getMetrics';

import { getRepo } from '../../../src/infrastructure/frameworks/getRepo';

import metricsResultsFresh from '../../../testdata/expectations/metrics-results-fresh.json';
import { testCachedMetrics } from '../../../testdata/database/LocalTestDatabase';

test.serial('It should get metrics', async (t) => {
  const expected: any = metricsResultsFresh;

  const repository = getRepo(true);
  const response = await getMetrics(repository, {
    repo: 'SOMEORG/SOMEREPO',
    from: '1665360000000',
    to: '1667174399000',
    offset: 0
  });

  t.deepEqual(response, expected);
});

test.serial('It should get cached metrics', async (t) => {
  const expected: any = testCachedMetrics;

  const repository = getRepo(true);
  const response = await getMetrics(repository, {
    repo: 'SOMEORG/SOMEREPO',
    from: '1642636800000',
    to: '1643587199000',
    offset: 0
  });

  t.deepEqual(response, expected);
});
