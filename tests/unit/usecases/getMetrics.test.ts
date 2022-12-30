import test from 'ava';

import { getMetricsUsecase } from '../../../src/usecases/getMetrics';

import { getRepo } from '../../../src/infrastructure/frameworks/getRepo';

import metrics2days from '../../../testdata/expectations/metrics-2days.json';
import metricsRangeUntilMostRecent from '../../../testdata/expectations/metrics-range-until-most-recent.json';

test.serial('It should get an empty array if no metrics exist', async (t) => {
  const expected: any = [];

  const repository = getRepo(true);
  const response = await getMetricsUsecase({
    repository,
    repoName: 'asdf',
    fromDate: '20220101'
  });

  t.deepEqual(response, expected);
});

test.serial('It should get metrics for a defined range', async (t) => {
  const expected: any = metrics2days;

  const repository = getRepo(true);
  const response = await getMetricsUsecase({
    repository,
    repoName: 'something',
    fromDate: '20221010',
    toDate: '20221030'
  });

  t.deepEqual(response, expected);
});

test.serial('It should get metrics for a range up until the most recent metrics', async (t) => {
  const expected: any = metricsRangeUntilMostRecent;

  const repository = getRepo(true);
  const response = await getMetricsUsecase({
    repository,
    repoName: 'something',
    fromDate: '20221010'
  });

  t.deepEqual(response, expected);
});

/**
 * NEGATIVE TESTS
 */

test.serial('It should throw a MissingRepoNameError if missing repository name', async (t) => {
  const expected: any = 'MissingRepoNameError';

  const repository = getRepo(true);
  const error: any = await t.throwsAsync(
    async () =>
      await getMetricsUsecase({
        repository,
        repoName: '',
        fromDate: '',
        toDate: ''
      })
  );

  t.is(error.name, expected);
});

test.serial(
  'It should throw a InvalidDateError if missing both "fromDate" and "toDate"',
  async (t) => {
    const expected: any = 'InvalidDateError';

    const repository = getRepo(true);
    const error: any = await t.throwsAsync(
      async () =>
        await getMetricsUsecase({
          repository,
          repoName: 'something',
          fromDate: '',
          toDate: ''
        })
    );

    t.is(error.name, expected);
  }
);
