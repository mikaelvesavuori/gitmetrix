import {
  DynamoDBClient,
  UpdateItemCommand,
  QueryCommand,
  PutItemCommand
} from '@aws-sdk/client-dynamodb';

import { CacheRequest, DataRequest, Repository } from '../../interfaces/Repository';
import {
  ParsedPickupTime,
  ParsedResult,
  ParsedResultBasic,
  ParsedReviewSize,
  ParsedReviewTime
} from '../../interfaces/Parser';
import { DynamoItems } from '../../interfaces/DynamoDb';
import { CleanedItem } from '../../interfaces/Item';
import { MetricsResult } from '../../interfaces/Metrics';

import { getCleanedItems } from '../frameworks/getCleanedItems';
import { addCustomMetric } from '../frameworks/addCustomMetric';

import { MissingEnvironmentVariablesDynamoError } from '../../application/errors/errors';

import { getCachedTestData } from '../../../testdata/database/DynamoTestDatabase';
import { getTestData } from '../../../testdata/database/DynamoTestDatabase';

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
   * If a `to` is not supplied, we will default to yesterday's date.
   *
   * We are caching the item prior to the "cleaning" and transformation so that the cache item
   * is as small as possible in storage.
   */
  public async getMetrics(dataRequest: DataRequest): Promise<CleanedItem[]> {
    const cachedData = await this.getItem(dataRequest);

    addCustomMetric('uncached');
    return getCleanedItems(cachedData?.Items || []);
  }

  /**
   * @description Get metrics from cache.
   */
  public async getCachedMetrics(dataRequest: DataRequest): Promise<MetricsResult> {
    const { key, from, to } = dataRequest;

    const command = {
      TableName: this.tableName,
      KeyConditionExpression: 'pk = :pk AND sk = :sk',
      ExpressionAttributeValues: {
        ':pk': { S: `CACHED_${key}` },
        ':sk': { S: `${from}_${to}` }
      },
      Limit: 1
    };

    // @ts-ignore
    const data: DynamoItems | null =
      process.env.NODE_ENV !== 'test'
        ? await this.dynamoDb.send(new QueryCommand(command))
        : getCachedTestData(key, from, to);

    addCustomMetric('cached');

    if (data?.Items && data.Items.length > 0) return JSON.parse(data.Items[0].data['S']);

    return {} as any;
  }

  /**
   * @description Caches metrics with PutItem command.
   */
  public async cacheMetrics(cacheRequest: CacheRequest): Promise<void> {
    const { key, range, metrics } = cacheRequest;

    const command = {
      TableName: this.tableName,
      Item: {
        pk: { S: `CACHED_${key}` },
        sk: { S: range },
        data: { S: JSON.stringify(metrics) }
      }
    };

    /* istanbul ignore next */
    if (process.env.NODE_ENV !== 'test') await this.dynamoDb.send(new PutItemCommand(command));
  }

  //////////
  // Push //
  //////////

  /**
   * @description Add a "pushed" metric.
   */
  public async addPushed(input: ParsedResultBasic) {
    const { repo, timestamp } = input;

    const command = {
      ExpressionAttributeValues: {
        ':p': { N: '1' },
        ':start_value': { N: '0' }
      },
      UpdateExpression: 'SET p = if_not_exists(p, :start_value) + :p'
    };

    await this.updateItem(repo, timestamp, command);
  }

  ///////////////////
  // Pull requests //
  ///////////////////

  /**
   * @description Add an "opened" metric.
   */
  public async addOpenedPr(input: ParsedResultBasic) {
    const { repo, timestamp } = input;

    const command = {
      ExpressionAttributeValues: {
        ':o': { N: '1' },
        ':start_value': { N: '0' }
      },
      UpdateExpression: 'SET o = if_not_exists(o, :start_value) + :o'
    };

    await this.updateItem(repo, timestamp, command);
  }

  /**
   * @description Add a "merged" metric.
   */
  public async addMergedPr(input: ParsedResultBasic) {
    const { repo, timestamp } = input;

    const command = {
      ExpressionAttributeValues: {
        ':m': { N: '1' },
        ':start_value': { N: '0' }
      },
      UpdateExpression: 'SET m = if_not_exists(m, :start_value) + :m'
    };

    await this.updateItem(repo, timestamp, command);
  }

  /**
   * @description Add a "closed" metric.
   */
  public async addClosedPr(input: ParsedResultBasic) {
    const { repo, timestamp } = input;

    const command = {
      ExpressionAttributeValues: {
        ':cl': { N: '1' },
        ':start_value': { N: '0' }
      },
      UpdateExpression: 'SET cl = if_not_exists(cl, :start_value) + :cl'
    };

    await this.updateItem(repo, timestamp, command);
  }

  ////////////
  // Review //
  ////////////

  /**
   * @description Add a "comment" metric.
   */
  public async addComment(input: ParsedResultBasic) {
    const { repo, timestamp } = input;

    const command = {
      ExpressionAttributeValues: {
        ':cm': { N: '1' },
        ':start_value': { N: '0' }
      },
      UpdateExpression: 'SET cm = if_not_exists(cm, :start_value) + :cm'
    };

    await this.updateItem(repo, timestamp, command);
  }

  /**
   * @description Add an "approval" metric.
   */
  public async addApproval(input: ParsedResultBasic) {
    const { repo, timestamp } = input;

    const command = {
      ExpressionAttributeValues: {
        ':ap': { N: '1' },
        ':start_value': { N: '0' }
      },
      UpdateExpression: 'SET ap = if_not_exists(ap, :start_value) + :ap'
    };

    await this.updateItem(repo, timestamp, command);
  }

  /**
   * @description Add a "changes requested" metric.
   */
  public async addChangesRequested(input: ParsedResultBasic) {
    const { repo, timestamp } = input;

    const command = {
      ExpressionAttributeValues: {
        ':chr': { N: '1' },
        ':start_value': { N: '0' }
      },
      UpdateExpression: 'SET chr = if_not_exists(chr, :start_value) + :chr'
    };

    await this.updateItem(repo, timestamp, command);
  }

  ////////////////////
  // Sizes and times /
  ////////////////////

  /**
   * @description Add all metrics for a review size update.
   */
  public async addReviewSize(result: ParsedResult) {
    const { repo, timestamp } = result;
    const { additions, changedFiles, deletions } = result.change as ParsedReviewSize;

    const command = {
      ExpressionAttributeValues: {
        ':ad': { N: `${additions}` },
        ':chf': { N: `${changedFiles}` },
        ':d': { N: `${deletions}` },
        ':start_value': { N: '0' }
      },
      UpdateExpression:
        'SET ad = if_not_exists(ad, :start_value) + :ad, chf = if_not_exists(chf, :start_value) + :chf, d = if_not_exists(d, :start_value) + :d'
    };

    await this.updateItem(repo, timestamp, command);
  }

  /**
   * @description Add pick-up time to aggregate.
   */
  public async addPickupTime(result: ParsedResult) {
    const { repo, timestamp } = result;
    const time = result.change as ParsedPickupTime;

    const command = {
      ExpressionAttributeValues: {
        ':pt': { N: `${time}` },
        ':start_value': { N: '0' }
      },
      UpdateExpression: 'SET pt = if_not_exists(pt, :start_value) + :pt'
    };

    await this.updateItem(repo, timestamp, command);
  }

  /**
   * @description Add review time to aggregate.
   */
  public async addReviewTime(result: ParsedResult) {
    const { repo, timestamp } = result;
    const time = result.change as ParsedReviewTime;

    const command = {
      ExpressionAttributeValues: {
        ':rt': { N: `${time}` },
        ':start_value': { N: '0' }
      },
      UpdateExpression: 'SET rt = if_not_exists(rt, :start_value) + :rt'
    };

    await this.updateItem(repo, timestamp, command);
  }

  /////////////////////
  // Private methods //
  /////////////////////

  /**
   * @description Get data from DynamoDB.
   */
  private async getItem(dataRequest: DataRequest): Promise<any> {
    const { key, from, to } = dataRequest;

    const command = {
      TableName: this.tableName,
      KeyConditionExpression: 'pk = :pk AND sk BETWEEN :sk AND :to',
      ExpressionAttributeValues: {
        ':pk': { S: `METRICS_${key}` },
        ':sk': { S: from },
        ':to': { S: to }
      }
    };

    return process.env.NODE_ENV !== 'test'
      ? await this.dynamoDb.send(new QueryCommand(command))
      : getTestData(key);
  }

  /**
   * @description Updates an item in the DynamoDB table.
   */
  private async updateItem(
    repo: string,
    timestamp: string,
    parameters: Record<string, any>
  ): Promise<void> {
    const command = {
      ...parameters,
      Key: {
        pk: { S: `METRICS_${repo}` },
        sk: { S: timestamp }
      },
      TableName: this.tableName
    };

    /* istanbul ignore next */
    if (process.env.NODE_ENV !== 'test') await this.dynamoDb.send(new UpdateItemCommand(command));
  }
}
