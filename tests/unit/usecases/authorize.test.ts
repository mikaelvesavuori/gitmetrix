import test from 'ava';

import { authorizeUseCase } from '../../../src/usecases/authorize';

test.serial(
  'It should allow a call with the correct authorization query string parameter',
  async (t) => {
    const expected = 'Allow';
    const response = await authorizeUseCase({
      body: {},
      headers: {
        'User-Agent': ''
      },
      httpMethod: 'GET',
      methodArn: '',
      queryStringParameters: {
        authorization: '65a662ab-9d57-4f72-aff1-3a63e0738ace'
      },
      resource: '/AddMetrics'
    });
    // @ts-ignore
    const effect = response['policyDocument']['Statement'][0]['Effect'];
    t.deepEqual(effect, expected);
  }
);

test.serial('It should return a CORS response for an OPTIONS call', async (t) => {
  const expected = {
    body: '"OK"',
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      'Access-Control-Allow-Origin': '*',
      Vary: 'Origin'
    },
    statusCode: 200
  };
  const response = await authorizeUseCase({
    body: {},
    headers: {
      'User-Agent': ''
    },
    httpMethod: 'OPTIONS',
    methodArn: '',
    // @ts-ignore
    queryStringParameters: {},
    resource: '/AddMetrics'
  });
  t.deepEqual(response, expected);
});

/**
 * NEGATIVE TESTS
 */
test.serial('It should deny a call without headers', async (t) => {
  const expected = 'Deny';
  const response = await authorizeUseCase({
    body: {},
    httpMethod: 'GET',
    methodArn: '',
    // @ts-ignore
    queryStringParameters: {},
    resource: '/AddMetrics'
  });
  // @ts-ignore
  const effect = response['policyDocument']['Statement'][0]['Effect'];
  t.deepEqual(effect, expected);
});

test.serial(
  'It should deny a call with incorrect authorization query string parameter',
  async (t) => {
    const expected = 'Deny';
    const response = await authorizeUseCase({
      body: {},
      headers: {
        'User-Agent': ''
      },
      httpMethod: 'GET',
      methodArn: '',
      queryStringParameters: {
        authorization: 'asdf'
      },
      resource: '/AddMetrics'
    });
    // @ts-ignore
    const effect = response['policyDocument']['Statement'][0]['Effect'];
    t.deepEqual(effect, expected);
  }
);
