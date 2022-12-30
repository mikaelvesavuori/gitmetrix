import test from 'ava';

import { mapResultToUsecase } from '../../../src/application/mapResultToUsecase';

import { getRepo } from '../../../src/infrastructure/frameworks/getRepo';

import { setEnv, clearEnv } from '../../testUtils';

/**
 * Local mock repository
 */

const repo = getRepo(true);

test.serial('It should handle the "Pushed" use case using the local repository', async (t) => {
  const expected = true;
  const input: any = [
    {
      repoName: 'SOMEORG/SOMEREPO',
      type: 'Pushed'
    }
  ];

  const response = await mapResultToUsecase(input, repo);

  t.deepEqual(response, expected);
});

test.serial('It should handle the "Commented" use case using the local repository', async (t) => {
  const expected = true;
  const input: any = [
    {
      repoName: 'SOMEORG/SOMEREPO',
      type: 'Commented'
    }
  ];

  const response = await mapResultToUsecase(input, repo);

  t.deepEqual(response, expected);
});

test.serial('It should handle the "Opened" use case using the local repository', async (t) => {
  const expected = true;
  const input: any = [
    {
      repoName: 'SOMEORG/SOMEREPO',
      type: 'Opened'
    }
  ];

  const response = await mapResultToUsecase(input, repo);

  t.deepEqual(response, expected);
});

test.serial('It should handle the "Closed" use case using the local repository', async (t) => {
  const expected = true;
  const input: any = [
    {
      repoName: 'SOMEORG/SOMEREPO',
      type: 'Closed'
    }
  ];

  const response = await mapResultToUsecase(input, repo);

  t.deepEqual(response, expected);
});

test.serial('It should handle the "Merged" use case using the local repository', async (t) => {
  const expected = true;
  const input: any = [
    {
      repoName: 'SOMEORG/SOMEREPO',
      type: 'Merged'
    }
  ];

  const response = await mapResultToUsecase(input, repo);

  t.deepEqual(response, expected);
});

test.serial('It should handle the "Approved" use case using the local repository', async (t) => {
  const expected = true;
  const input: any = [
    {
      repoName: 'SOMEORG/SOMEREPO',
      type: 'Approved'
    }
  ];

  const response = await mapResultToUsecase(input, repo);

  t.deepEqual(response, expected);
});

test.serial(
  'It should handle the "ChangesRequested" use case using the local repository',
  async (t) => {
    const expected = true;
    const input: any = [
      {
        repoName: 'SOMEORG/SOMEREPO',
        type: 'ChangesRequested'
      }
    ];

    const response = await mapResultToUsecase(input, repo);

    t.deepEqual(response, expected);
  }
);

test.serial('It should handle the "PickupTime" use case using the local repository', async (t) => {
  const expected = true;
  const input: any = [
    {
      repoName: 'SOMEORG/SOMEREPO',
      type: 'PickupTime'
    }
  ];

  const response = await mapResultToUsecase(input, repo);

  t.deepEqual(response, expected);
});

test.serial('It should handle the "ReviewTime" use case using the local repository', async (t) => {
  const expected = true;
  const input: any = [
    {
      repoName: 'SOMEORG/SOMEREPO',
      type: 'ReviewTime'
    }
  ];

  const response = await mapResultToUsecase(input, repo);

  t.deepEqual(response, expected);
});

test.serial('It should handle the "ReviewSize" use case using the local repository', async (t) => {
  const expected = true;
  const input: any = [
    {
      repoName: 'SOMEORG/SOMEREPO',
      type: 'ReviewSize'
    }
  ];

  const response = await mapResultToUsecase(input, repo);

  t.deepEqual(response, expected);
});

/**
 * DynamoDB repository
 */

setEnv();
const ddbRepo = getRepo(false);

test.serial('It should handle the "Pushed" use case using the DynamoDB repository', async (t) => {
  const expected = true;
  const input: any = [
    {
      repoName: 'SOMEORG/SOMEREPO',
      type: 'Pushed'
    }
  ];

  const response = await mapResultToUsecase(input, ddbRepo);

  t.deepEqual(response, expected);
});

test.serial(
  'It should handle the "Commented" use case using the DynamoDB repository',
  async (t) => {
    const expected = true;
    const input: any = [
      {
        repoName: 'SOMEORG/SOMEREPO',
        type: 'Commented'
      }
    ];

    const response = await mapResultToUsecase(input, ddbRepo);

    t.deepEqual(response, expected);
  }
);

test.serial('It should handle the "Opened" use case using the DynamoDB repository', async (t) => {
  const expected = true;
  const input: any = [
    {
      repoName: 'SOMEORG/SOMEREPO',
      type: 'Opened'
    }
  ];

  const response = await mapResultToUsecase(input, ddbRepo);

  t.deepEqual(response, expected);
});

test.serial('It should handle the "Closed" use case using the DynamoDB repository', async (t) => {
  const expected = true;
  const input: any = [
    {
      repoName: 'SOMEORG/SOMEREPO',
      type: 'Closed'
    }
  ];

  const response = await mapResultToUsecase(input, ddbRepo);

  t.deepEqual(response, expected);
});

test.serial('It should handle the "Merged" use case using the DynamoDB repository', async (t) => {
  const expected = true;
  const input: any = [
    {
      repoName: 'SOMEORG/SOMEREPO',
      type: 'Merged'
    }
  ];

  const response = await mapResultToUsecase(input, ddbRepo);

  t.deepEqual(response, expected);
});

test.serial('It should handle the "Approved" use case using the DynamoDB repository', async (t) => {
  const expected = true;
  const input: any = [
    {
      repoName: 'SOMEORG/SOMEREPO',
      type: 'Approved'
    }
  ];

  const response = await mapResultToUsecase(input, ddbRepo);

  t.deepEqual(response, expected);
});

test.serial(
  'It should handle the "ChangesRequested" use case using the DynamoDB repository',
  async (t) => {
    const expected = true;
    const input: any = [
      {
        repoName: 'SOMEORG/SOMEREPO',
        type: 'ChangesRequested'
      }
    ];

    const response = await mapResultToUsecase(input, ddbRepo);

    t.deepEqual(response, expected);
  }
);

test.serial(
  'It should handle the "PickupTime" use case using the DynamoDB repository',
  async (t) => {
    const expected = true;
    const input: any = [
      {
        repoName: 'SOMEORG/SOMEREPO',
        type: 'PickupTime'
      }
    ];

    const response = await mapResultToUsecase(input, ddbRepo);

    t.deepEqual(response, expected);
  }
);

test.serial(
  'It should handle the "ReviewTime" use case using the DynamoDB repository',
  async (t) => {
    const expected = true;
    const input: any = [
      {
        repoName: 'SOMEORG/SOMEREPO',
        type: 'ReviewTime'
      }
    ];

    const response = await mapResultToUsecase(input, ddbRepo);

    t.deepEqual(response, expected);
  }
);

test.serial(
  'It should handle the "ReviewSize" use case using the DynamoDB repository',
  async (t) => {
    const expected = true;
    const input: any = [
      {
        repoName: 'SOMEORG/SOMEREPO',
        type: 'ReviewSize',
        change: {
          additions: 1,
          changedFiles: 3,
          deletions: 3
        }
      }
    ];

    const response = await mapResultToUsecase(input, ddbRepo);

    t.deepEqual(response, expected);
  }
);

clearEnv();
