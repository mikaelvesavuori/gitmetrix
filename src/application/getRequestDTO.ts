import {
  getMaxTimestampFromDate,
  getTimestampForInputDate,
  getTimestampsForPeriod,
  getCurrentDate
} from 'chrono-utils';

import { RequestDTO } from '../interfaces/Input';

import {
  InvalidOffsetError,
  MissingRepoNameError,
  MissingRequiredInputParamsError,
  OutOfRangeQueryError,
  TooManyInputParamsError
} from './errors/errors';

/**
 * @description Retrieve query string parameters from an AWS Lambda event.
 */
export function getRequestDTO(queryStringParameters: Record<string, any>): RequestDTO {
  const repo = sanitizeKey(queryStringParameters, 'repo') as string;
  const from = sanitizeKey(queryStringParameters, 'from') as string;
  const to = sanitizeKey(queryStringParameters, 'to') as string;
  const offset = sanitizeKey(queryStringParameters, 'offset', true) as number;
  const lastNumDays = sanitizeKey(queryStringParameters, 'last', true) as number;

  validateRequestInput(repo, to, from, lastNumDays, offset);

  const requestDto: Record<string, any> = {
    repo
  };

  setTimestamps();

  function setTimestamps() {
    if (lastNumDays) {
      const { from, to } = getTimestampsForPeriod(lastNumDays, offset);
      requestDto['from'] = from;
      requestDto['to'] = to;
    } else {
      const fromDate = getTimestampForInputDate(from, offset);
      const toDate = getTimestampForInputDate(to, offset, true);
      requestDto['from'] = fromDate;
      requestDto['to'] = toDate;
    }
  }

  validateDateRange(requestDto['to'], requestDto['from'], offset);

  requestDto['offset'] = offset;
  return requestDto as RequestDTO;
}

/**
 * @description Validates user request input.
 */
function validateRequestInput(
  repo: string,
  to: string,
  from: string,
  lastNumDays: number,
  offsetInHours: number
) {
  if (!repo) throw new MissingRepoNameError();
  if ((!to || !from) && !lastNumDays) throw new MissingRequiredInputParamsError();
  if (from && to && lastNumDays) throw new TooManyInputParamsError();
  if (offsetInHours < -12 || offsetInHours > 12) throw new InvalidOffsetError();
}

/**
 * @description Validate the final date range (timestamps).
 */
function validateDateRange(toDate: string, fromDate: string, offset: number) {
  const MAX_DATE_RANGE = parseInt(process.env.MAX_DATE_RANGE || '') || 365;

  // Set max "to" stop at today
  const maxToDate = getTimestampForInputDate(getCurrentDate(true), offset);
  // Set max "from" stop at midnight X number of days ago
  const maxFromDate = getMaxTimestampFromDate(MAX_DATE_RANGE, offset);

  if (parseInt(toDate) >= parseInt(maxToDate)) throw new OutOfRangeQueryError();
  if (parseInt(fromDate) < parseInt(maxFromDate)) throw new OutOfRangeQueryError();
}

/**
 * @description Minor sanity fix on input.
 */
const sanitizeKey = (
  queryStringParameters: Record<string, string>,
  key: string,
  isNumeric = false
) => {
  if (isNumeric) return queryStringParameters[key] ? parseInt(queryStringParameters[key]) : 0;

  return queryStringParameters[key] ? queryStringParameters[key] : ('' as string);
};
