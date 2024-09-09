import { test, expect } from 'vitest';

import { getParser } from '../../../src/application/getParser';
import { NoMatchingParserError } from '../../../src/application/errors/errors';

/**
 * NEGATIVE TESTS
 */

test('It should throw a NoMatchingParserError if a matching parser is not found', () => {
  expect(() => getParser({})).toThrowError(NoMatchingParserError);
});
