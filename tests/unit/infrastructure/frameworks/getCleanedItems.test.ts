import test from 'ava';

import { getCleanedItems } from '../../../../src/infrastructure/frameworks/getCleanedItems';

/**
 * POSITIVE TESTS
 */

test.serial('It should get a set of cleaned DynamoDB items', (t) => {
  const expected = [
    {
      '20221201': {
        additions: '9',
        changedFiles: '3',
        comments: '3',
        deletions: '2',
        merged: '2'
      }
    }
  ];

  const input = [
    {
      pk: { S: 'METRICS_MYPRODUCT' },
      sk: { S: '20221201' },
      ad: { S: '9' },
      chf: { S: '3' },
      d: { S: '2' },
      m: { S: '2' },
      cm: { S: '3' }
    }
  ];

  const response = getCleanedItems(input);

  t.deepEqual(response, expected);
});

test.serial('It should return an empty array if items are not of expected shape', (t) => {
  const expected: any = [];

  const input: any = {
    something: {
      a: 123
    }
  };
  const response = getCleanedItems(input);

  t.deepEqual(response, expected);
});

/**
 * NEGATIVE TESTS
 */

test.serial('It should throw a NoMappedKeyError if there is no key to map to', (t) => {
  const expected = 'NoMappedKeyError';

  const input: any = [
    {
      sk: { S: '20221201' },
      xxx: {}
    }
  ];
  const error: any = t.throws(() => getCleanedItems(input));

  t.is(error.name, expected);
});
