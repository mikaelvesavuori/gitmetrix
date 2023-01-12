import {
  DynamoDBClient,
  UpdateItemCommand,
  QueryCommand,
  PutItemCommand
} from '@aws-sdk/client-dynamodb';

import { Repository } from '../../interfaces/Repository';
import {
  ParsedPickupTime,
  ParsedResult,
  ParsedReviewSize,
  ParsedReviewTime
} from '../../interfaces/Parser';
import { MetricInput } from '../../interfaces/MetricInput';
import { DynamoItem, DynamoItems } from '../../interfaces/DynamoDb';
import { CleanedItem } from '../../interfaces/Item';

import { getCleanedItems } from '../frameworks/getCleanedItems';
import { getDateBefore } from '../frameworks/date';
import { addCustomMetric } from '../frameworks/addCustomMetric';

import { MissingEnvironmentVariablesDynamoError } from '../../application/errors';

/**
 * @description Factory function to create a DynamoDB repository.
 */
export function createNewDynamoRepository() {
  return new DynamoDbRepository();
}

/**
 * @description Concrete implementation of DynamoDB repository.
 * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html
 */
export class DynamoDbRepository implements Repository {
  readonly dynamoDb: DynamoDBClient;
  readonly tableName: string;
  readonly region: string;

  constructor() {
    const REGION = process.env.REGION;
    const TABLE_NAME = process.env.TABLE_NAME;
    if (!REGION || !TABLE_NAME) throw new MissingEnvironmentVariablesDynamoError();

    this.tableName = TABLE_NAME;
    this.region = REGION;
    this.dynamoDb = new DynamoDBClient({ region: this.region });
  }

  /////////////
  // Metrics //
  /////////////

  /**
   * @description Get metrics for a given repository and a period of time.
   *
   * If a `toDate` is not supplied, we will default to yesterday's date.
   *
   * We are caching the item prior to the "cleaning" and transformation so that the cache item
   * is as small as possible in storage.
   */
  public async getMetrics(
    repoName: string,
    fromDate: string,
    toDate?: string
  ): Promise<CleanedItem[]> {
    if (!toDate) toDate = getDateBefore(true);

    const key = `METRICS_CACHED_${repoName}`;
    const range = `${fromDate}_${toDate}`;

    // Check cache
    const cachedData = await this.getCachedData(key, range);
    if (cachedData.length > 0) {
      addCustomMetric('cached');
      return getCleanedItems(cachedData);
    }

    // Get fresh data and cache it
    addCustomMetric('uncached');
    const data = await this.getItem(repoName, fromDate, toDate);
    const items = data?.Items || '';
    if (items && items.length > 0) await this.cacheItem(key, range, items);

    return getCleanedItems(items);
  }

  //////////
  // Push //
  //////////

  /**
   * @description Add a "pushed" metric.
   */
  public async addPushed(input: MetricInput) {
    const { repoName, date } = input;

    const params = {
      ExpressionAttributeValues: {
        ':p': { N: '1' },
        ':start_value': { N: '0' }
      },
      UpdateExpression: 'SET p = if_not_exists(p, :start_value) + :p'
    };

    await this.updateItem(repoName, date, params);
  }

  ///////////////////
  // Pull requests //
  ///////////////////

  /**
   * @description Add an "opened" metric.
   */
  public async addOpenedPr(input: MetricInput) {
    const { repoName, date } = input;

    const params = {
      ExpressionAttributeValues: {
        ':o': { N: '1' },
        ':start_value': { N: '0' }
      },
      UpdateExpression: 'SET o = if_not_exists(o, :start_value) + :o'
    };

    await this.updateItem(repoName, date, params);
  }

  /**
   * @description Add a "merged" metric.
   */
  public async addMergedPr(input: MetricInput) {
    const { repoName, date } = input;

    const params = {
      ExpressionAttributeValues: {
        ':m': { N: '1' },
        ':start_value': { N: '0' }
      },
      UpdateExpression: 'SET m = if_not_exists(m, :start_value) + :m'
    };

    await this.updateItem(repoName, date, params);
  }

  /**
   * @description Add a "closed" metric.
   */
  public async addClosedPr(input: MetricInput) {
    const { repoName, date } = input;

    const params = {
      ExpressionAttributeValues: {
        ':cl': { N: '1' },
        ':start_value': { N: '0' }
      },
      UpdateExpression: 'SET cl = if_not_exists(cl, :start_value) + :cl'
    };

    await this.updateItem(repoName, date, params);
  }

  ////////////
  // Review //
  ////////////

  /**
   * @description Add a "comment" metric.
   */
  public async addComment(input: MetricInput) {
    const { repoName, date } = input;

    const params = {
      ExpressionAttributeValues: {
        ':cm': { N: '1' },
        ':start_value': { N: '0' }
      },
      UpdateExpression: 'SET cm = if_not_exists(cm, :start_value) + :cm'
    };

    await this.updateItem(repoName, date, params);
  }

  /**
   * @description Add an "approval" metric.
   */
  public async addApproval(input: MetricInput) {
    const { repoName, date } = input;

    const params = {
      ExpressionAttributeValues: {
        ':ap': { N: '1' },
        ':start_value': { N: '0' }
      },
      UpdateExpression: 'SET ap = if_not_exists(ap, :start_value) + :ap'
    };

    await this.updateItem(repoName, date, params);
  }

  /**
   * @description Add a "changes requested" metric.
   */
  public async addChangesRequested(input: MetricInput) {
    const { repoName, date } = input;

    const params = {
      ExpressionAttributeValues: {
        ':chr': { N: '1' },
        ':start_value': { N: '0' }
      },
      UpdateExpression: 'SET chr = if_not_exists(chr, :start_value) + :chr'
    };

    await this.updateItem(repoName, date, params);
  }

  ////////////////////
  // Sizes and times /
  ////////////////////

  /**
   * @description Add all metrics for a review size update.
   */
  public async addReviewSize(result: ParsedResult) {
    const { repoName, date } = result;
    const { additions, changedFiles, deletions } = result.change as ParsedReviewSize;

    const params = {
      ExpressionAttributeValues: {
        ':ad': { N: `${additions}` },
        ':chf': { N: `${changedFiles}` },
        ':d': { N: `${deletions}` },
        ':start_value': { N: '0' }
      },
      UpdateExpression:
        'SET ad = if_not_exists(ad, :start_value) + :ad, chf = if_not_exists(chf, :start_value) + :chf, d = if_not_exists(d, :start_value) + :d'
    };

    await this.updateItem(repoName, date, params);
  }

  /**
   * @description Add pick-up time to aggregate.
   */
  public async addPickupTime(result: ParsedResult) {
    const { repoName, date } = result;
    const time = result.change as ParsedPickupTime;

    const params = {
      ExpressionAttributeValues: {
        ':pt': { N: `${time}` },
        ':start_value': { N: '0' }
      },
      UpdateExpression: 'SET pt = if_not_exists(pt, :start_value) + :pt'
    };

    await this.updateItem(repoName, date, params);
  }

  /**
   * @description Add review time to aggregate.
   */
  public async addReviewTime(result: ParsedResult) {
    const { repoName, date } = result;
    const time = result.change as ParsedReviewTime;

    const params = {
      ExpressionAttributeValues: {
        ':rt': { N: `${time}` },
        ':start_value': { N: '0' }
      },
      UpdateExpression: 'SET rt = if_not_exists(rt, :start_value) + :rt'
    };

    await this.updateItem(repoName, date, params);
  }

  /////////////////////
  // Private methods //
  /////////////////////

  /**
   * @description Get data from DynamoDB.
   */
  private async getItem(repoName: string, fromDate: string, toDate: string): Promise<DynamoItems> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'pk = :pk AND sk BETWEEN :from AND :to',
      ExpressionAttributeValues: {
        ':pk': { S: `METRICS_${repoName}` },
        ':from': { S: fromDate },
        ':to': { S: toDate }
      }
    };

    // @ts-ignore
    return process.env.NODE_ENV !== 'test'
      ? await this.dynamoDb.send(new QueryCommand(params))
      : { Items: testDataItem };
  }

  /**
   * @description Updates an item in the DynamoDB table.
   */
  private async updateItem(
    repoName: string,
    date: string,
    parameters: Record<string, any>
  ): Promise<void> {
    const params = {
      ...parameters,
      Key: {
        pk: { S: `METRICS_${repoName}` },
        sk: { S: date }
      },
      TableName: this.tableName
    };

    /* istanbul ignore next */
    if (process.env.NODE_ENV !== 'test') await this.dynamoDb.send(new UpdateItemCommand(params));
  }

  /**
   * @description Caches item with PutItem.
   */
  private async cacheItem(key: string, range: string, data: DynamoItem[]): Promise<void> {
    const params = {
      Item: {
        pk: { S: key },
        sk: { S: range },
        data: { S: JSON.stringify(data) }
      },
      TableName: this.tableName
    };

    /* istanbul ignore next */
    if (process.env.NODE_ENV !== 'test') await this.dynamoDb.send(new PutItemCommand(params));
  }

  /**
   * @description Get cached data.
   */
  private async getCachedData(key: string, range: string): Promise<DynamoItem[]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'pk = :pk AND sk = :sk',
      ExpressionAttributeValues: {
        ':pk': { S: key },
        ':sk': { S: range }
      },
      Limit: 1
    };

    const useCachedTestData = process.env.USE_CACHED_TEST_DATA === 'true';

    // @ts-ignore
    const cachedData: DynamoItems | null = useCachedTestData
      ? cachedTestData
      : process.env.NODE_ENV !== 'test'
        ? await this.dynamoDb.send(new QueryCommand(params))
        : null;

    if (cachedData?.Items && cachedData.Items.length > 0)
      return JSON.parse(cachedData.Items[0].data['S']);

    return [];
  }
}

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
 * @description DynamoDB mock response
 */
const cachedTestData = {
  Items: [
    {
      data: {
        S: JSON.stringify(testDataItem)
      }
    }
  ]
};
