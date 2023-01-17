import { createNewResultService } from '../domain/services/Result';
import { GitHubParser } from '../domain/services/GitHubParser';

import { Parser } from '../interfaces/Parser';

import { NoMatchingParserError } from './errors/errors';

/**
 * @description Infer the correct parser to use, based on metadata from headers.
 */
export function getParser(headers: Record<string, any>): Parser {
  const resultService = createNewResultService();

  const ua: string = headers?.['User-Agent'] || headers?.['user-agent'];
  if (ua && ua.includes('GitHub')) return new GitHubParser(resultService);
  throw new NoMatchingParserError();
}
