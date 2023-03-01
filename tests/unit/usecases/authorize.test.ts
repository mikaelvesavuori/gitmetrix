import test from 'ava';

import { authorize } from '../../../src/usecases/authorize';

test.serial(
  'It should allow a call with the correct authorization query string parameter',
  async (t) => {
    const expected = true;
    const response: Record<string, any> = await authorize({
      body: {},
      headers: {
        'User-Agent': ''
      },
      identitySource: ['65a662ab-9d57-4f72-aff1-3a63e0738ace']
    });
    const result = response['isAuthorized'];
    t.deepEqual(result, expected);
  }
);

test.serial('It should allow a call with the correct authorization header', async (t) => {
  const expected = true;
  const response: Record<string, any> = await authorize({
    body: {},
    headers: {
      'User-Agent': '',
      Authorization: '65a662ab-9d57-4f72-aff1-3a63e0738ace'
    },
    identitySource: []
  });
  const result = response['isAuthorized'];
  t.deepEqual(result, expected);
});

test.serial('It should return a CORS response for an OPTIONS call', async (t) => {
  const expected = {
    body: '"OK"',
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*'
    },
    statusCode: 200
  };
  const response: Record<string, any> = await authorize({
    body: {},
    headers: {
      'User-Agent': ''
    },
    requestContext: {
      http: {
        method: 'OPTIONS'
      }
    },
    identitySource: []
  });
  t.deepEqual(response, expected);
});

/**
 * NEGATIVE TESTS
 */
test.serial('It should deny a call without headers', async (t) => {
  const expected = false;
  // @ts-ignore
  const response: Record<string, any> = await authorize({
    body: {}
  });
  const result = response['isAuthorized'];
  t.deepEqual(result, expected);
});

test.serial(
  'It should deny a call with incorrect authorization query string parameter',
  async (t) => {
    const expected = false;
    const response: Record<string, any> = await authorize({
      body: {},
      headers: {
        'User-Agent': ''
      },
      identitySource: ['asdf']
    });
    const result = response['isAuthorized'];
    t.deepEqual(result, expected);
  }
);
