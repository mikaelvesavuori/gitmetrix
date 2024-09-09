import { TestDataRepository } from './testDataRepository';

// Configuration
const REGION = process.env.REGION || 'eu-north-1';
const TABLE_NAME = process.env.TABLE_NAME || 'gitmetrix';
const REPO_NAME = process.env.REPO_NAME || 'SOMEORG/SOMEREPO';
const DEFAULT_COUNT = process.env.DEFAULT_COUNT || 30;

/**
 * @description Outputs a valid metric object.
 */
function createDemoMetric(timestamp: string) {
  return {
    [timestamp]: {
      additions: randomInteger(),
      approved: randomInteger(),
      changedFiles: randomInteger(),
      changesRequested: randomInteger(),
      closed: randomInteger(),
      comments: randomInteger(),
      deletions: randomInteger(),
      merged: randomInteger(),
      opened: randomInteger(),
      pickupTime: randomTime(),
      pushed: randomInteger(),
      reviewTime: randomTime()
    }
  };
}

/**
 * @description Generates a random integer up to a maximum value.
 * Optionally, can take `addLeadingZero` for values that need to be
 * double digit such as `05`.
 */
function randomInteger(maxValue = 100, addLeadingZero = false) {
  const value = Math.round(Math.random() * maxValue);
  if (addLeadingZero && value.toString().length === 1) return `0${value}`;
  return value;
}

/**
 * @description Generates a random time that will later be read back in the format `02:13:51:04`.
 * Cap at a full day.
 */
function randomTime() {
  return Math.floor(Math.random() * 86400);
}

/**
 * @description Writes metrics to DynamoDB under the `METRICS_{REPO_NAME}` primary key.
 */
async function writeMetrics(metrics: Record<string, any>[]) {
  const ddb = new TestDataRepository(REPO_NAME, TABLE_NAME, REGION);

  const promises = metrics.map(async (metric: Record<string, any>) => {
    await ddb.updateItem(metric);
  });

  await Promise.all(promises);
}

/**
 * @description The controller for test data generation.
 */
async function createTestDataController(dataCount = DEFAULT_COUNT as number) {
  const demoData: any = [];
  for (let index = 0; index < dataCount; index++) {
    const date = new Date('2022-10-01');
    date.setDate(date.getUTCDate() + index);
    demoData.push(createDemoMetric(`${date.getTime()}`));
  }

  await writeMetrics(demoData);
}

// Run
createTestDataController();
