import { test, expect } from 'vitest';

import { authorize } from '../../../src/usecases/authorize';

test('It should allow a call with the correct authorization query string parameter', async () => {
  const expected = true;
  // @ts-ignore
  const response: Record<string, any> = await authorize({
    body: {},
    headers: {
      'User-Agent': ''
    },
    identitySource: ['65a662ab-9d57-4f72-aff1-3a63e0738ace']
  });
  const result = response['isAuthorized'];
  expect(result).toBe(expected);
});

test('It should allow a call with the correct authorization header', async () => {
  const expected = true;
  // @ts-ignore
  const response: Record<string, any> = await authorize({
    body: {},
    headers: {
      'User-Agent': '',
      Authorization: '65a662ab-9d57-4f72-aff1-3a63e0738ace'
    },
    identitySource: []
  });
  const result = response['isAuthorized'];
  expect(result).toBe(expected);
});

test('It should return a CORS response for an OPTIONS call', async () => {
  const expected = {
    body: '"OK"',
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*'
    },
    statusCode: 200
  };
  // @ts-ignore
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
  expect(response).toMatchObject(expected);
});

/**
 * NEGATIVE TESTS
 */
test('It should deny a call without headers', async () => {
  const expected = false;
  // @ts-ignore
  const response: Record<string, any> = await authorize({
    body: {}
  });
  const result = response['isAuthorized'];
  expect(result).toBe(expected);
});

test('It should deny a call with incorrect authorization query string parameter', async () => {
  const expected = false;
  // @ts-ignore
  const response: Record<string, any> = await authorize({
    body: {},
    headers: {
      'User-Agent': ''
    },
    identitySource: ['asdf']
  });
  const result = response['isAuthorized'];
  expect(result).toBe(expected);
});
