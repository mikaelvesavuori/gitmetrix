import test from 'ava';

import { createNewLocalRepository } from '../../../../src/infrastructure/repositories/LocalRepository';

import metricsRawBetweenFromAndToDates from '../../../../testdata/expectations/metrics-raw-between-from-and-to-dates.json';
import metricsRawRangeOfDates from '../../../../testdata/expectations/metrics-raw-range-of-dates.json';

test.serial(
  'It should get raw metrics for all dates between a supplied "fromDate" and yesterday',
  async (t) => {
    const expected = metricsRawBetweenFromAndToDates;

    const repo = createNewLocalRepository();

    const response = await repo.getMetrics('something', '20221030');

    t.deepEqual(response, expected);
  }
);

test.serial('It should get raw metrics for a range of dates', async (t) => {
  const expected = metricsRawRangeOfDates;

  const repo = createNewLocalRepository();

  const response = await repo.getMetrics('something', '20221010', '20221030');

  t.deepEqual(response, expected);
});
