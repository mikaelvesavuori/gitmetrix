import test from 'ava';

import {
  getDiffInSeconds,
  prettifyTime,
  prettyTimeToSeconds,
  zuluToUnix
} from '../../../../src/infrastructure/frameworks/time';

test.serial('It should get the difference in seconds between two timestamps', (t) => {
  const expected = 100;
  const response = getDiffInSeconds(1670873500000, 1670873600000);
  t.deepEqual(response, expected);
});

test.serial(
  'It should convert a numeric count of seconds into a colon-separated time format',
  (t) => {
    const expected = '00:00:01:00';
    const response = prettifyTime(60);
    t.deepEqual(response, expected);
  }
);

test.serial('It should convert an ISO 8601/RFC 3339 time format to a Unix timestamp', (t) => {
  const expected = 1669027317000;
  const response = zuluToUnix('2022-11-21T10:41:57Z');
  t.deepEqual(response, expected);
});

test.serial('It should convert a prettified time value to a numeric count of seconds', (t) => {
  const expected = 34104;
  const response = prettyTimeToSeconds('00:09:28:24');
  t.deepEqual(response, expected);
});

test.serial('It should return zero when no time is passed in', (t) => {
  const expected = 0;
  // @ts-ignore
  const response = prettyTimeToSeconds();
  t.deepEqual(response, expected);
});

test.serial('It should return zero when "00:00:00:00" is passed in', (t) => {
  const expected = 0;
  const response = prettyTimeToSeconds('00:00:00:00');
  t.deepEqual(response, expected);
});
