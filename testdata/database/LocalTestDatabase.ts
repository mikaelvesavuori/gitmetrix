import { getDateFromTimestamp } from 'chrono-utils';

/**
 * @description Raw stored metrics.
 */
const data = [
  {
    '1659909600000': {
      repoName: 'SOMEORG/SOMEREPO',
      additions: 5,
      approved: 52,
      changedFiles: 2,
      changesRequested: 4,
      closed: 5,
      comments: 2,
      deletions: 6,
      merged: 8,
      opened: 5,
      pickupTime: '00:02:52:21',
      pushed: 3,
      reviewTime: '00:03:42:52'
    }
  },
  {
    '1663192800000': {
      repoName: 'something-else',
      additions: 2,
      approved: 4,
      changedFiles: 6,
      changesRequested: 3,
      closed: 8,
      comments: 0,
      deletions: 4,
      merged: 3,
      opened: 2,
      pickupTime: '00:04:42:27',
      pushed: 1,
      reviewTime: '03:20:45:17'
    }
  },
  {
    '1665352800000': {
      repoName: 'SOMEORG/SOMEREPO',
      additions: 82,
      approved: 7,
      changedFiles: 23,
      changesRequested: 2,
      closed: 3,
      comments: 5,
      deletions: 2,
      merged: 1,
      opened: 2,
      pickupTime: '00:00:00:00',
      pushed: 2,
      reviewTime: '00:01:21:46'
    }
  },
  {
    '1665698400000': {
      repoName: 'SOMEORG/SOMEREPO',
      additions: ''
    }
  },
  {
    '1667080800000': {
      repoName: 'SOMEORG/SOMEREPO',
      additions: 412,
      approved: 12,
      changedFiles: 3,
      changesRequested: 2,
      closed: 1,
      comments: 3,
      deletions: 5,
      merged: 0,
      opened: 4,
      pickupTime: '00:00:00:00',
      pushed: 6,
      reviewTime: '00:00:11:30'
    }
  },
  {
    '1671318000000': {
      repoName: 'SOMEORG/SOMEREPO',
      additions: 51,
      approved: 2,
      changedFiles: 22,
      changesRequested: 4,
      closed: 6,
      comments: 8,
      deletions: 8,
      merged: 4,
      opened: 3,
      pickupTime: '02:01:03:10',
      pushed: 1,
      reviewTime: '00:02:42:03'
    }
  }
];

/**
 * @description Cached test metrics.
 */
export const testCachedMetrics = {
  repo: 'SOMEORG/SOMEREPO',
  period: { from: '20220120', to: '20220130', offset: 0 },
  total: {
    additions: 576,
    approved: 691,
    changedFiles: 620,
    changesRequested: 463,
    closed: 577,
    comments: 492,
    deletions: 494,
    merged: 327,
    opened: 661,
    pickupTime: '05:23:23:30',
    pushed: 609,
    reviewTime: '04:04:31:16'
  },
  average: {
    additions: 52,
    approved: 63,
    changedFiles: 56,
    changesRequested: 42,
    closed: 52,
    comments: 45,
    deletions: 45,
    merged: 30,
    opened: 60,
    pickupTime: '00:13:02:08',
    pushed: 55,
    reviewTime: '00:09:08:18'
  },
  daily: {
    '20220120': {
      additions: 95,
      approved: 74,
      changedFiles: 1,
      changesRequested: 64,
      closed: 57,
      comments: 44,
      deletions: 86,
      merged: 3,
      opened: 45,
      pickupTime: '00:08:18:30',
      pushed: 21,
      reviewTime: '00:00:48:48'
    },
    '20220121': {
      additions: 41,
      approved: 83,
      changedFiles: 99,
      changesRequested: 30,
      closed: 28,
      comments: 51,
      deletions: 84,
      merged: 20,
      opened: 70,
      pickupTime: '00:10:30:18',
      pushed: 64,
      reviewTime: '00:03:14:44'
    },
    '20220122': {
      additions: 82,
      approved: 41,
      changedFiles: 71,
      changesRequested: 79,
      closed: 86,
      comments: 66,
      deletions: 54,
      merged: 46,
      opened: 40,
      pickupTime: '00:23:23:33',
      pushed: 77,
      reviewTime: '00:15:08:41'
    },
    '20220123': {
      additions: 15,
      approved: 86,
      changedFiles: 62,
      changesRequested: 9,
      closed: 16,
      comments: 58,
      deletions: 55,
      merged: 36,
      opened: 85,
      pickupTime: '00:15:30:53',
      pushed: 55,
      reviewTime: '00:05:10:46'
    },
    '20220124': {
      additions: 96,
      approved: 21,
      changedFiles: 1,
      changesRequested: 10,
      closed: 21,
      comments: 36,
      deletions: 0,
      merged: 17,
      opened: 58,
      pickupTime: '00:07:42:35',
      pushed: 41,
      reviewTime: '00:01:33:07'
    },
    '20220125': {
      additions: 27,
      approved: 90,
      changedFiles: 65,
      changesRequested: 21,
      closed: 67,
      comments: 22,
      deletions: 21,
      merged: 84,
      opened: 50,
      pickupTime: '00:20:33:32',
      pushed: 26,
      reviewTime: '00:10:03:20'
    },
    '20220126': {
      additions: 8,
      approved: 74,
      changedFiles: 97,
      changesRequested: 71,
      closed: 20,
      comments: 72,
      deletions: 50,
      merged: 56,
      opened: 62,
      pickupTime: '00:03:52:31',
      pushed: 89,
      reviewTime: '00:21:47:38'
    },
    '20220127': {
      additions: 54,
      approved: 73,
      changedFiles: 94,
      changesRequested: 17,
      closed: 93,
      comments: 55,
      deletions: 43,
      merged: 9,
      opened: 87,
      pickupTime: '00:19:13:01',
      pushed: 51,
      reviewTime: '00:00:45:20'
    },
    '20220128': {
      additions: 84,
      approved: 62,
      changedFiles: 39,
      changesRequested: 57,
      closed: 5,
      comments: 23,
      deletions: 10,
      merged: 18,
      opened: 85,
      pickupTime: '00:11:04:53',
      pushed: 87,
      reviewTime: '00:18:40:55'
    },
    '20220129': {
      additions: 53,
      approved: 46,
      changedFiles: 39,
      changesRequested: 43,
      closed: 84,
      comments: 33,
      deletions: 35,
      merged: 25,
      opened: 36,
      pickupTime: '00:22:44:23',
      pushed: 48,
      reviewTime: '00:05:37:45'
    },
    '20220130': {
      additions: 21,
      approved: 41,
      changedFiles: 52,
      changesRequested: 62,
      closed: 100,
      comments: 32,
      deletions: 56,
      merged: 13,
      opened: 43,
      pickupTime: '00:00:29:21',
      pushed: 50,
      reviewTime: '00:17:40:12'
    }
  }
};

/**
 * @description Return cached test data or basic empty shape.
 */
export function getCachedTestData(key: string, fromDate: string, toDate: string) {
  const fixedKey = key.toUpperCase();
  const range = `${getDateFromTimestamp(fromDate)}_${getDateFromTimestamp(toDate)}`;

  if (fixedKey === 'SOMEORG/SOMEREPO' && range === '20220120_20220130') return testCachedMetrics;
  return {};
}

/**
 * @description Return test data or basic empty shape.
 */
export function getTestData(key: string, toDate: string, fromDate: string) {
  const fixedKey = key.toUpperCase();

  if (fixedKey === 'SOMEORG/SOMEREPO') {
    return data
      .map((item: Record<string, any>) => {
        const timestamp = Object.keys(item)[0];

        if (
          item[timestamp].repoName.toUpperCase() === fixedKey &&
          timestamp >= fromDate &&
          timestamp <= toDate
        ) {
          return item;
        }
      })
      .filter((item: any) => item);
  }

  return [];
}
