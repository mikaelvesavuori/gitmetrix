import { test, expect } from 'vitest';
import { getCurrentDate, getTimestampForInputDate } from 'chrono-utils';

import { getParser } from '../../../src/application/getParser';

import {
  MissingRepoNameError,
  NoCommentParsingMatchError,
  NoParsingMatchFoundError,
  NoPullRequestParsingMatchError,
  NoReviewParsingMatchError
} from '../../../src/application/errors/errors';

import issueCommentCreated from '../../../testdata/webhooks/issue_comment-created.json';
import prApproved from '../../../testdata/webhooks/pull_request_review-submitted-approved.json';
import prChangesRequested from '../../../testdata/webhooks/pull_request_review-submitted-changes_requested.json';
import push from '../../../testdata/webhooks/push.json';
import prOpened from '../../../testdata/webhooks/pull_request-opened.json';
import prClosed from '../../../testdata/webhooks/pull_request-closed.json';
import prMerged from '../../../testdata/webhooks/pull_request-closed-merged.json';
import readyForReview from '../../../testdata/webhooks/pull_request-ready_for_review.json';

const parser = getParser({
  'User-Agent': 'GitHub'
});
const currentTime = getTimestampForInputDate(getCurrentDate(true));

test('It should parse a push event', () => {
  const expected: any = [
    {
      timestamp: currentTime,
      repo: 'SOMEORG/SOMEREPO',
      type: 'Pushed'
    }
  ];

  const response = parser.parse(push);

  expect(response).toMatchObject(expected);
});

test('It should parse a "ready for review" event', () => {
  const expected: any = [
    {
      timestamp: currentTime,
      change: {
        additions: 1,
        changedFiles: 1,
        deletions: 0
      },
      repo: 'SOMEORG/SOMEREPO',
      type: 'ReviewSize'
    }
  ];

  const response = parser.parse(readyForReview);

  expect(response).toMatchObject(expected);
});

test('It should parse a "PR opened" event', () => {
  const expected: any = [
    {
      change: {
        additions: 1,
        changedFiles: 1,
        deletions: 0
      },
      repo: 'SOMEORG/SOMEREPO',
      timestamp: currentTime,
      type: 'ReviewSize'
    },
    {
      timestamp: currentTime,
      repo: 'SOMEORG/SOMEREPO',
      type: 'Opened'
    }
  ];

  const response = parser.parse(prOpened);

  expect(response).toMatchObject(expected);
});

test('It should parse a "PR closed" event', () => {
  const expected: any = [
    {
      timestamp: currentTime,
      repo: 'SOMEORG/SOMEREPO',
      type: 'Closed'
    }
  ];

  const response = parser.parse(prClosed);

  expect(response).toMatchObject(expected);
});

test('It should parse a "PR merged" event', () => {
  const expected: any = [
    {
      timestamp: currentTime,
      repo: 'SOMEORG/SOMEREPO',
      type: 'Merged'
    },
    {
      timestamp: currentTime,
      repo: 'SOMEORG/SOMEREPO',
      type: 'Closed'
    },
    {
      timestamp: currentTime,
      change: 7,
      repo: 'SOMEORG/SOMEREPO',
      type: 'ReviewTime'
    }
  ];

  const response = parser.parse(prMerged);

  expect(response).toMatchObject(expected);
});

test('It should parse a "issue comment merged" event', () => {
  const expected: any = [
    {
      timestamp: currentTime,
      repo: 'SOMEORG/SOMEREPO',
      type: 'Commented'
    }
  ];

  const response = parser.parse(issueCommentCreated);

  expect(response).toMatchObject(expected);
});

test('It should parse a "approved" event', () => {
  const expected: any = [
    {
      timestamp: currentTime,
      repo: 'SOMEORG/SOMEREPO',
      type: 'Approved'
    },
    {
      change: 145,
      timestamp: currentTime,
      repo: 'SOMEORG/SOMEREPO',
      type: 'PickupTime'
    }
  ];

  const response = parser.parse(prApproved);

  expect(response).toMatchObject(expected);
});

test('It should parse a "changes requested" event', () => {
  const expected: any = [
    {
      timestamp: currentTime,
      repo: 'SOMEORG/SOMEREPO',
      type: 'ChangesRequested'
    },
    {
      change: 105,
      timestamp: currentTime,
      repo: 'SOMEORG/SOMEREPO',
      type: 'PickupTime'
    }
  ];

  const response = parser.parse(prChangesRequested);

  expect(response).toMatchObject(expected);
});

/**
 * NEGATIVE TESTS
 */

test('It should throw a MissingRepoNameError if the repository name is missing', () => {
  // @ts-ignore
  expect(() => parser.parse({})).toThrowError(MissingRepoNameError);
});

test('It should throw a NoParsingMatchFoundError if no parsing match can be found', () => {
  const input = {
    body: {
      repository: {
        full_name: 'something'
      }
    }
  };

  // @ts-ignore
  expect(() => parser.parse(input)).toThrowError(NoParsingMatchFoundError);
});

test('It should throw a NoCommentParsingMatchError if a parsing was not matched for a comment', () => {
  const input = {
    headers: {
      'x-github-event': 'issue_comment'
    },
    body: {
      repository: {
        full_name: 'something'
      }
    }
  };

  // @ts-ignore
  expect(() => parser.parse(input)).toThrowError(NoCommentParsingMatchError);
});

test('It should throw a NoPullRequestParsingMatchError if a parsing was not matched for a pull request', () => {
  const input = {
    headers: {
      'x-github-event': 'pull_request'
    },
    body: {
      repository: {
        full_name: 'something'
      }
    }
  };

  // @ts-ignore
  expect(() => parser.parse(input)).toThrowError(NoPullRequestParsingMatchError);
});

test('It should throw a NoReviewParsingMatchError if a parsing was not matched for a pull request review', () => {
  const input = {
    headers: {
      'x-github-event': 'pull_request_review'
    },
    body: {
      repository: {
        full_name: 'something'
      }
    }
  };

  // @ts-ignore
  expect(() => parser.parse(input)).toThrowError(NoReviewParsingMatchError);
});

test('It should throw a NoReviewParsingMatchError if an unknown PR submitted state is seen', () => {
  const input = {
    headers: {
      'x-github-event': 'pull_request_review'
    },
    body: {
      action: 'submitted',
      review: {
        state: 'something-that-does-not-exist'
      },
      repository: {
        full_name: 'something'
      }
    }
  };

  // @ts-ignore
  expect(() => parser.parse(input)).toThrowError(NoReviewParsingMatchError);
});
