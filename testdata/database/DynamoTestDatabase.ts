/**
 * @description Dummy data for testing purposes.
 */
const testDataItem = [
  {
    chf: { N: '67' },
    rt: { N: '5313' },
    d: { N: '50' },
    ad: { N: '67' },
    pt: { N: '1413' },
    cl: { N: '33' },
    cm: { N: '40' },
    m: { N: '29' },
    chr: { N: '60' },
    o: { N: '58' },
    p: { N: '23' },
    ap: { N: '22' },
    sk: { S: '20221115' },
    pk: { S: 'METRICS_SOMEORG/SOMEREPO' }
  }
];

/**
 * @description Cached test metrics.
 */
export const testCachedMetrics = {
  repo: 'SOMEORG/SOMEREPO',
  period: { from: '20220120', to: '20220131', offset: 0 },
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
    }
  }
};

/**
 * @description Return cached test data or basic empty shape.
 */
export function getCachedTestData(key: string, fromDate: string, toDate: string) {
  const fixedKey = key.toUpperCase();
  const range = `${fromDate}_${toDate}`;

  if (fixedKey === 'SOMEORG/SOMEREPO' && range === '20220101_20220131')
    return {
      Items: [
        {
          data: {
            S: JSON.stringify(testCachedMetrics)
          }
        }
      ]
    };

  return { Items: [] };
}

/**
 * @description Return test data or basic empty shape.
 */
export function getTestData(key: string) {
  const fixedKey = key.toUpperCase();

  if (fixedKey === 'SOMEORG/SOMEREPO')
    return {
      Items: testDataItem
    };

  return { Items: [] };
}
