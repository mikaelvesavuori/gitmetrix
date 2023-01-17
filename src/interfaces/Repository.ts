import { CleanedItem } from './Item';
import { MetricsResult } from './Metrics';
import { ParsedResult, ParsedResultBasic } from './Parser';

/**
 * @description The Repository allows us to access a database of some kind.
 */
export interface Repository {
  /**
   * @description Get metrics from repository.
   */
  getMetrics(dataRequest: DataRequest): Promise<CleanedItem[]>;

  /**
   * @description Get metrics from cache.
   */
  getCachedMetrics(dataRequest: DataRequest): Promise<MetricsResult>;

  /**
   * @description Cache Metrics item into read-optimized result.
   */
  cacheMetrics(cacheRequest: CacheRequest): Promise<void>;

  /**
   * @description Add an Approval metric to the repository.
   */
  addApproval(input: ParsedResultBasic): Promise<void>;

  /**
   * @description Add a Changes Requested metric to the repository.
   */
  addChangesRequested(input: ParsedResultBasic): Promise<void>;

  /**
   * @description Add a PR Closed metric to the repository.
   */
  addClosedPr(input: ParsedResultBasic): Promise<void>;

  /**
   * @description Add a Comment metric to the repository.
   */
  addComment(input: ParsedResultBasic): Promise<void>;

  /**
   * @description Add a PR Merged metric to the repository.
   */
  addMergedPr(input: ParsedResultBasic): Promise<void>;

  /**
   * @description Add a PR Opened metric to the repository.
   */
  addOpenedPr(input: ParsedResultBasic): Promise<void>;

  /**
   * @description Add a Pushed metric to the repository.
   */
  addPushed(input: ParsedResultBasic): Promise<void>;

  /**
   * @description Add a Pick-up Time metric to the repository.
   */
  addPickupTime(result: ParsedResult): Promise<void>;

  /**
   * @description Add a Review Size metric to the repository.
   */
  addReviewSize(result: ParsedResult): Promise<void>;

  /**
   * @description Add a Review Time metric to the repository.
   */
  addReviewTime(result: ParsedResult): Promise<void>;
}

/**
 * @description Input request to retrieve data from the repository.
 */
export type DataRequest = {
  /**
   * @description The repository name.
   */
  key: string;
  /**
   * @description Unix timestamp for which time we query "from".
   */
  from: string;
  /**
   * @description Unix timestamp for which time we query "to".
   */
  to: string;
};

/**
 * @description Input request to cache a Metrics object.
 */
export type CacheRequest = {
  /**
   * @description The key (Git repo name) under which to cache.
   * @example `SOMEORG/SOMEREPO`
   */
  key: string;
  /**
   * @description The date range for the lookup.
   * @example `20230101_20230131`
   */
  range: string;
  /**
   * @description A valid and complete `Metrics` object.
   */
  metrics: MetricsResult;
};
