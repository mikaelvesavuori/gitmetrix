import { MikroLog } from 'mikrolog';

import { EventInput } from '../interfaces/Aws';

import { handleCors } from '../infrastructure/frameworks/authorization/handleCors';
import { generatePolicy } from '../infrastructure/frameworks/authorization/generatePolicy';

import { MissingAuthorizationError, InvalidAuthTokenError } from '../application/errors/errors';

const AUTHORIZATION_TOKEN =
  process.env.NODE_ENV === 'test'
    ? '65a662ab-9d57-4f72-aff1-3a63e0738ace'
    : process.env.AUTH_TOKEN || '';

/**
 * @description Authorizer that will check for the `authorization` query string
 * parameter or `Authorization` header for an authorization token and see if it's
 * the correct and expected one.
 *
 * @example `?authorization=65a662ab-9d57-4f72-aff1-3a63e0738ace` query string parameter.
 * @example `Authorization: 65a662ab-9d57-4f72-aff1-3a63e0738ace` header.
 */
export async function authorize(event: EventInput) {
  try {
    // @ts-ignore
    if (event.httpMethod === 'OPTIONS') return handleCors();

    const userToken = getAuthToken(event);
    if (!userToken) throw new MissingAuthorizationError();

    const isValid = userToken === AUTHORIZATION_TOKEN;
    if (!isValid) throw new InvalidAuthTokenError();

    return generatePolicy(userToken, 'Allow', event.methodArn, '');
  } catch (error: any) {
    const message: string = error.message;
    const logger = MikroLog.start();
    logger.error(message);
    const id = getAuthToken(event) || 'UNKNOWN';
    return generatePolicy(id, 'Deny', event.methodArn, {});
  }
}

const getAuthToken = (event: EventInput) =>
  event.headers?.['Authorization'] || event.queryStringParameters?.['authorization'] || '';
