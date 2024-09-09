import { test, expect } from 'vitest';

import { getCleanedItems } from '../../../../src/infrastructure/frameworks/getCleanedItems';

import { NoMappedKeyError } from '../../../../src/application/errors/errors';

/**
 * POSITIVE TESTS
 */

test('It should get a set of cleaned DynamoDB items', () => {
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

  expect(response).toMatchObject(expected);
});

test('It should return an empty array if items are not of expected shape', () => {
  const expected: any = [];

  const input: any = {
    something: {
      a: 123
    }
  };
  const response = getCleanedItems(input);

  expect(response).toMatchObject(expected);
});

/**
 * NEGATIVE TESTS
 */

test('It should throw a NoMappedKeyError if there is no key to map to', () => {
  const input: any = [
    {
      sk: { S: '20221201' },
      xxx: {}
    }
  ];

  expect(() => getCleanedItems(input)).toThrowError(NoMappedKeyError);
});
