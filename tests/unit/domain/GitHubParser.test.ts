import test from 'ava';

import { getParser } from '../../../src/application/getParser';

import { getCurrentDate } from '../../../src/infrastructure/frameworks/date';

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
const currentDate = getCurrentDate(true);

test.serial('It should parse a push event', (t) => {
  const expected: any = [
    {
      date: currentDate,
      repoName: 'SOMEORG/SOMEREPO',
      type: 'Pushed'
    }
  ];

  const response = parser.parse(push);

  t.deepEqual(response, expected);
});

test.serial('It should parse a "ready for review" event', (t) => {
  const expected: any = [
    {
      date: currentDate,
      change: {
        additions: 1,
        changedFiles: 1,
        deletions: 0
      },
      repoName: 'SOMEORG/SOMEREPO',
      type: 'ReviewSize'
    }
  ];

  const response = parser.parse(readyForReview);

  t.deepEqual(response, expected);
});

test.serial('It should parse a "PR opened" event', (t) => {
  const expected: any = [
    {
      date: getCurrentDate(true),
      repoName: 'SOMEORG/SOMEREPO',
      type: 'Opened'
    }
  ];

  const response = parser.parse(prOpened);

  t.deepEqual(response, expected);
});

test.serial('It should parse a "PR closed" event', (t) => {
  const expected: any = [
    {
      date: currentDate,
      repoName: 'SOMEORG/SOMEREPO',
      type: 'Closed'
    }
  ];

  const response = parser.parse(prClosed);

  t.deepEqual(response, expected);
});

test.serial('It should parse a "PR merged" event', (t) => {
  const expected: any = [
    {
      date: currentDate,
      repoName: 'SOMEORG/SOMEREPO',
      type: 'Merged'
    },
    {
      date: currentDate,
      repoName: 'SOMEORG/SOMEREPO',
      type: 'Closed'
    },
    {
      date: currentDate,
      change: 7,
      repoName: 'SOMEORG/SOMEREPO',
      type: 'ReviewTime'
    }
  ];

  const response = parser.parse(prMerged);

  t.deepEqual(response, expected);
});

test.serial('It should parse a "issue comment merged" event', (t) => {
  const expected: any = [
    {
      date: getCurrentDate(true),
      repoName: 'SOMEORG/SOMEREPO',
      type: 'Commented'
    }
  ];

  const response = parser.parse(issueCommentCreated);

  t.deepEqual(response, expected);
});

test.serial('It should parse a "approved" event', (t) => {
  const expected: any = [
    {
      date: getCurrentDate(true),
      repoName: 'SOMEORG/SOMEREPO',
      type: 'Approved'
    },
    {
      change: 145,
      date: getCurrentDate(true),
      repoName: 'SOMEORG/SOMEREPO',
      type: 'PickupTime'
    }
  ];

  const response = parser.parse(prApproved);

  t.deepEqual(response, expected);
});

test.serial('It should parse a "changes requested" event', (t) => {
  const expected: any = [
    {
      date: getCurrentDate(true),
      repoName: 'SOMEORG/SOMEREPO',
      type: 'ChangesRequested'
    },
    {
      change: 105,
      date: getCurrentDate(true),
      repoName: 'SOMEORG/SOMEREPO',
      type: 'PickupTime'
    }
  ];

  const response = parser.parse(prChangesRequested);

  t.deepEqual(response, expected);
});

/**
 * NEGATIVE TESTS
 */

test.serial('It should throw a MissingRepoNameError if the repository name is missing', (t) => {
  const expected = 'MissingRepoNameError';

  // @ts-ignore
  const error: any = t.throws(() => parser.parse({}));

  t.is(error.name, expected);
});

test.serial('It should throw a NoParsingMatchFoundError if no parsing match can be found', (t) => {
  const expected = 'NoParsingMatchFoundError';

  const error: any = t.throws(() =>
    // @ts-ignore
    parser.parse({
      body: {
        repository: {
          full_name: 'something'
        }
      }
    })
  );

  t.is(error.name, expected);
});

test.serial(
  'It should throw a NoCommentParsingMatchError if a parsing was not matched for a comment',
  (t) => {
    const expected = 'NoCommentParsingMatchError';

    const error: any = t.throws(() =>
      parser.parse({
        headers: {
          'x-github-event': 'issue_comment'
        },
        body: {
          repository: {
            full_name: 'something'
          }
        }
      })
    );

    t.is(error.name, expected);
  }
);

test.serial(
  'It should throw a NoPullRequestParsingMatchError if a parsing was not matched for a pull request',
  (t) => {
    const expected = 'NoPullRequestParsingMatchError';

    const error: any = t.throws(() =>
      parser.parse({
        headers: {
          'x-github-event': 'pull_request'
        },
        body: {
          repository: {
            full_name: 'something'
          }
        }
      })
    );

    t.is(error.name, expected);
  }
);

test.serial(
  'It should throw a NoReviewParsingMatchError if a parsing was not matched for a pull request review',
  (t) => {
    const expected = 'NoReviewParsingMatchError';

    const error: any = t.throws(() =>
      parser.parse({
        headers: {
          'x-github-event': 'pull_request_review'
        },
        body: {
          repository: {
            full_name: 'something'
          }
        }
      })
    );

    t.is(error.name, expected);
  }
);

test.serial(
  'It should throw a NoReviewParsingMatchError if an unknown PR submitted state is seen',
  (t) => {
    const expected = 'NoReviewParsingMatchError';

    const error: any = t.throws(() =>
      parser.parse({
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
      })
    );

    t.is(error.name, expected);
  }
);
