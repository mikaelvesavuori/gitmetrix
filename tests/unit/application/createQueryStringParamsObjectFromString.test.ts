import test from 'ava';

import { createQueryStringParamsObjectFromString } from '../../../src/application/createQueryStringParamsObjectFromString';

/**
 * POSITIVE TESTS
 */

test.serial('It should return a clean object from a query parameter string', (t) => {
  const expected = { repo: 'SOMEORG/SOMEREPO', from: '20230220', to: '20230225' };

  const result = createQueryStringParamsObjectFromString({
    rawQueryString: 'repo=SOMEORG/SOMEREPO&from=20230220&to=20230225'
  });

  t.deepEqual(result, expected);
});

test.serial('It should return an empty object for an unknown input', (t) => {
  const expected = {};

  const result = createQueryStringParamsObjectFromString({});

  t.deepEqual(result, expected);
});
