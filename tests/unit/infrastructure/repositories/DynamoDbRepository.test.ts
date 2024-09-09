import { test, expect } from 'vitest';

import { createNewDynamoRepository } from '../../../../src/infrastructure/repositories/DynamoDbRepository';

import { setEnv, clearEnv } from '../../../testUtils';

import { testCachedMetrics } from '../../../../testdata/database/DynamoTestDatabase';
import { MissingEnvironmentVariablesDynamoError } from '../../../../src/application/errors/errors';

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

test('It should get uncached data', async () => {
  setEnv();
  const repo = createNewDynamoRepository();

  const response = await repo.getMetrics({
    key: 'SOMEORG/SOMEREPO',
    from: '20221010',
    to: '20221231'
  });

  expect(response).toMatchObject(expected);
  clearEnv();
});

test('It should get an empty array if no match is found for fresh metrics', async () => {
  setEnv();
  const expected: any = [];
  const repo = createNewDynamoRepository();

  const response = await repo.getMetrics({
    key: 'asdf',
    from: '20230101',
    to: '20230102'
  });

  expect(response).toMatchObject(expected);
  clearEnv();
});

test('It should get cached data', async () => {
  setEnv();
  const repo = createNewDynamoRepository();

  const response = await repo.getCachedMetrics({
    key: 'SOMEORG/SOMEREPO',
    from: '20220101',
    to: '20220131'
  });

  expect(response).toMatchObject(testCachedMetrics);
  clearEnv();
});

test('It should get an empty object if no match is found for cached metrics', async () => {
  setEnv();
  const expected: Record<string, any> = {};
  const repo = createNewDynamoRepository();

  const response = await repo.getCachedMetrics({
    key: 'asdf',
    from: '20230101',
    to: '20230102'
  });

  expect(response).toMatchObject(expected);
  clearEnv();
});

test('It should cache metrics', async () => {
  setEnv();
  const repo = createNewDynamoRepository();

  await repo.cacheMetrics({
    key: 'asdf',
    range: '20230101_20230102',
    metrics: testCachedMetrics
  });

  expect(1).toBe(1);
  clearEnv();
});

/**
 * NEGATIVE TESTS
 */

test('It should throw a MissingEnvironmentVariablesDynamoError if the required DynamoDB environment variables do not exist', async () => {
  expect(async () => createNewDynamoRepository()).rejects.toThrowError(
    MissingEnvironmentVariablesDynamoError
  );
});
