import { MikroLog } from 'mikrolog';

import { EventInput } from '../interfaces/Lambda';

import { handleCors } from '../infrastructure/frameworks/authorization/handleCors';

import { InvalidAuthTokenError } from '../application/errors/errors';

const AUTHORIZATION_TOKEN =
  process.env.NODE_ENV === 'test'
    ? '6d0bf792-ad5a-49af-9ff5-78fbc15a3e8a'
    : process.env.API_KEY || '';

/**
 * @description Authorizer that will check for the `authorization` query string
 * parameter or `Authorization` header for an authorization token and see if it's
 * the correct and expected one.
 *
 * @example `?authorization=6d0bf792-ad5a-49af-9ff5-78fbc15a3e8a` query string parameter.
 * @example `Authorization: 6d0bf792-ad5a-49af-9ff5-78fbc15a3e8a` header.
 */
export async function authorize(event: EventInput) {
  try {
    if (event?.requestContext?.http?.method === 'OPTIONS') return handleCors();

    const userToken = getAuthToken(event);
    const isValid = userToken === AUTHORIZATION_TOKEN;
    if (!isValid) throw new InvalidAuthTokenError();

    return {
      isAuthorized: true
    };
  } catch (error: any) {
    const message: string = error.message;
    const logger = MikroLog.start();
    logger.error(message);
    return {
      isAuthorized: false
    };
  }
}

const getAuthToken = (event: EventInput) =>
  event.headers?.['Authorization'] ||
  event?.queryStringParameters?.['authorization'] ||
  event?.identitySource[0] ||
  '';
