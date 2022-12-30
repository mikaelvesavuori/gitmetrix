import test from 'ava';

import { createNewDynamoRepository } from '../../../../src/infrastructure/repositories/DynamoDbRepository';

import { setEnv, clearEnv } from '../../../testUtils';

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

  const response = await repo.getMetrics('something', '20221010', '20221231');

  t.deepEqual(response, expected);
  clearEnv();
});

test.serial('It should get cached data', async (t) => {
  setEnv();
  process.env.USE_CACHED_TEST_DATA = 'true';
  const repo = createNewDynamoRepository();

  const response = await repo.getMetrics('something', '20221010', '20221020');

  t.deepEqual(response, expected);
  process.env.USE_CACHED_TEST_DATA = '';
  clearEnv();
});

/**
 * NEGATIVE TEST
 */

test.serial(
  'It should throw a MissingEnvironmentVariablesDynamoError if the required DynamoDB environment variables do not exist',
  async (t) => {
    const expected = 'MissingEnvironmentVariablesDynamoError';

    const error: any = await t.throwsAsync(async () => createNewDynamoRepository());

    t.is(error.name, expected);
  }
);
