import test from 'ava';

import { createNewDynamoRepository } from '../../../../src/infrastructure/repositories/DynamoDbRepository';

import { setEnv, clearEnv } from '../../../testUtils';

import { testCachedMetrics } from '../../../../testdata/database/DynamoTestDatabase';

const expected = [
  {
    20221115: {
      additions: '67',
      approved: '22',
      changedFiles: '67',
      changesRequested: '60',
      closed: '33',
      comments: '40',
      deletions: '50',
      merged: '29',
      opened: '58',
      pickupTime: '00:00:23:33',
      pushed: '23',
      reviewTime: '00:01:28:33'
    }
  }
];

test.serial('It should get uncached data', async (t) => {
  setEnv();
  const repo = createNewDynamoRepository();

  const response = await repo.getMetrics({
    key: 'SOMEORG/SOMEREPO',
    from: '20221010',
    to: '20221231'
  });

  t.deepEqual(response, expected);
  clearEnv();
});

test.serial('It should get an empty array if no match is found for fresh metrics', async (t) => {
  setEnv();
  const expected: any = [];
  const repo = createNewDynamoRepository();

  const response = await repo.getMetrics({
    key: 'asdf',
    from: '20230101',
    to: '20230102'
  });

  t.deepEqual(response, expected);
  clearEnv();
});

test.serial('It should get cached data', async (t) => {
  setEnv();
  const repo = createNewDynamoRepository();

  const response = await repo.getCachedMetrics({
    key: 'SOMEORG/SOMEREPO',
    from: '20220101',
    to: '20220131'
  });

  t.deepEqual(response, testCachedMetrics);
  clearEnv();
});

test.serial('It should get an empty object if no match is found for cached metrics', async (t) => {
  setEnv();
  const expected: Record<string, any> = {};
  const repo = createNewDynamoRepository();

  const response = await repo.getCachedMetrics({
    key: 'asdf',
    from: '20230101',
    to: '20230102'
  });

  t.deepEqual(response, expected);
  clearEnv();
});

test.serial('It should cache metrics', async (t) => {
  setEnv();
  const repo = createNewDynamoRepository();

  await repo.cacheMetrics({
    key: 'asdf',
    range: '20230101_20230102',
    metrics: testCachedMetrics
  });

  t.pass();
  clearEnv();
});

/**
 * NEGATIVE TESTS
 */

test.serial(
  'It should throw a MissingEnvironmentVariablesDynamoError if the required DynamoDB environment variables do not exist',
  async (t) => {
    const expected = 'MissingEnvironmentVariablesDynamoError';

    const error: any = await t.throwsAsync(async () => createNewDynamoRepository());

    t.is(error.name, expected);
  }
);
