import test from 'ava';
import { getParser } from '../../../src/application/getParser';

/**
 * NEGATIVE TESTS
 */

test.serial('It should throw a NoMatchingParserError if a matching parser is not found', (t) => {
  const expected = 'NoMatchingParserError';

  const error: any = t.throws(() => getParser({}));

  t.is(error.name, expected);
});
