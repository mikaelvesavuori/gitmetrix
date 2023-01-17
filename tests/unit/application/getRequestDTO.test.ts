import test from 'ava';
import { getDateYesterday, getTimestampsForPeriod } from 'chrono-utils';

import { getRequestDTO } from '../../../src/application/getRequestDTO';

const getRandomInteger = () => Math.floor(Math.random() * 15) + 1;

test.serial('It should create a request DTO for a set period', (t) => {
  const offset = 0;
  const expected = { repo: 'SOMEORG/SOMEREPO', from: '1669852800', to: '1672531199', offset };

  const result = getRequestDTO({
    from: '20221201',
    to: '20221231',
    offset,
    repo: 'SOMEORG/SOMEREPO'
  });

  t.deepEqual(result, expected);
});

test.serial('It should create a request DTO for a set period with a negative offset', (t) => {
  const offset = -5;
  const expected = { repo: 'SOMEORG/SOMEREPO', from: '1669834800', to: '1672513199', offset };

  const result = getRequestDTO({
    from: '20221201',
    to: '20221231',
    offset,
    repo: 'SOMEORG/SOMEREPO'
  });

  t.deepEqual(result, expected);
});

test.serial('It should create a request DTO for a set period with a positive offset', (t) => {
  const offset = 5;
  const expected = { repo: 'SOMEORG/SOMEREPO', from: '1669870800', to: '1672549199', offset };

  const result = getRequestDTO({
    from: '20221201',
    to: '20221231',
    offset,
    repo: 'SOMEORG/SOMEREPO'
  });

  t.deepEqual(result, expected);
});

test.serial('It should create a request DTO for a dynamic period', (t) => {
  const days = getRandomInteger();
  const { from, to } = getTimestampsForPeriod(days);
  const expected = { repo: 'SOMEORG/SOMEREPO', from, to, offset: 0 };

  const result = getRequestDTO({
    last: `${days}`,
    repo: 'SOMEORG/SOMEREPO'
  });

  t.deepEqual(result, expected);
});

test.serial('It should create a request DTO for a dynamic period with a negative offset', (t) => {
  const days = getRandomInteger();
  const offset = -5;
  const { from, to } = getTimestampsForPeriod(days, offset);
  const expected = { repo: 'SOMEORG/SOMEREPO', from, to, offset };

  const result = getRequestDTO({
    last: `${days}`,
    offset: `${offset}`,
    repo: 'SOMEORG/SOMEREPO'
  });

  t.deepEqual(result, expected);
});

test.serial('It should create a request DTO for a dynamic period with a positive offset', (t) => {
  const days = getRandomInteger();
  const offset = 5;
  const { from, to } = getTimestampsForPeriod(days, offset);
  const expected = { repo: 'SOMEORG/SOMEREPO', from, to, offset };

  const result = getRequestDTO({
    last: `${days}`,
    offset: `${offset}`,
    repo: 'SOMEORG/SOMEREPO'
  });

  t.deepEqual(result, expected);
});

/**
 * NEGATIVE TESTS
 */

test.serial('It should throw a MissingRepoNameError error if no repo name is present', (t) => {
  const expected = 'MissingRepoNameError';

  const error: any = t.throws(() =>
    getRequestDTO({
      from: '20221201',
      to: '20221231'
    })
  );

  t.is(error.name, expected);
});

test.serial(
  'It should throw a MissingRequiredInputParamsError error if no "to" date is present',
  (t) => {
    const expected = 'MissingRequiredInputParamsError';

    const error: any = t.throws(() =>
      getRequestDTO({
        repo: 'SOMEORG/SOMEREPO',
        from: '20221201'
      })
    );

    t.is(error.name, expected);
  }
);

test.serial(
  'It should throw a MissingRequiredInputParamsError error if no "from" date is present',
  (t) => {
    const expected = 'MissingRequiredInputParamsError';

    const error: any = t.throws(() =>
      getRequestDTO({
        repo: 'SOMEORG/SOMEREPO',
        to: '20221201'
      })
    );

    t.is(error.name, expected);
  }
);

test.serial(
  'It should throw a OutOfRangeQueryError error if the "to" date is beyond the maximum date range',
  (t) => {
    const expected = 'OutOfRangeQueryError';

    const error: any = t.throws(() =>
      getRequestDTO({
        repo: 'SOMEORG/SOMEREPO',
        from: '20221201',
        to: '20991231'
      })
    );

    t.is(error.name, expected);
  }
);

test.serial(
  'It should throw a OutOfRangeQueryError error if the "from" date is beyond the maximum date range',
  (t) => {
    const expected = 'OutOfRangeQueryError';

    const error: any = t.throws(() =>
      getRequestDTO({
        repo: 'SOMEORG/SOMEREPO',
        from: '19000101',
        to: getDateYesterday(true)
      })
    );

    t.is(error.name, expected);
  }
);

test.serial(
  'It should throw a TooManyInputParamsError error if using both "from" + "to" and "last" parameters',
  (t) => {
    const expected = 'TooManyInputParamsError';

    const error: any = t.throws(() =>
      getRequestDTO({
        repo: 'SOMEORG/SOMEREPO',
        from: '20221201',
        to: '20221231',
        last: '7'
      })
    );

    t.is(error.name, expected);
  }
);

test.serial('It should throw an InvalidOffsetError if offset is too small (negative)', (t) => {
  const expected = 'InvalidOffsetError';

  const error: any = t.throws(() =>
    getRequestDTO({
      repo: 'SOMEORG/SOMEREPO',
      from: '20221201',
      to: '20221231',
      offset: -13
    })
  );

  t.is(error.name, expected);
});

test.serial('It should throw an InvalidOffsetError if offset is too big (positive)', (t) => {
  const expected = 'InvalidOffsetError';

  const error: any = t.throws(() =>
    getRequestDTO({
      repo: 'SOMEORG/SOMEREPO',
      from: '20221201',
      to: '20221231',
      offset: 13
    })
  );

  t.is(error.name, expected);
});
