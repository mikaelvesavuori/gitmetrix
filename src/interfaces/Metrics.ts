import { CleanedItem } from './Item';

/**
 * @description Input for making metrics
 */
export type MakeMetricsInput = {
  items: CleanedItem[];
  repo: string;
  from: string;
  to: string;
  offset: number;
};

/**
 * @description The result of a metric.
 */
export type MetricsResult = {
  repo: string;
  period: Period;
  total: MetricSet;
  daily: DailyMetricSet;
  average: MetricSet;
};

/**
 * @description Time period object.
 */
type Period = {
  /**
   * @description The date the metrics start from.
   * @example `20221201`
   */
  from: string;
  /**
   * @description The date the metrics end at (inclusive).
   * @example `20221231`
   */
  to: string;
  /**
   * @description The UTC timezone offset used.
   * @example `0`
   * @example `-5`
   * @example `7`
   */
  offset: number;
};

/**
 * @description A set of metrics for a given date.
 */
export type DailyMetricSet = {
  [date: string]: MetricSet;
};

/**
 * @description Set of metrics.
 */
export type MetricSet = {
  additions: number;
  approved: number;
  changedFiles: number;
  changesRequested: number;
  closed: number;
  comments: number;
  deletions: number;
  merged: number;
  opened: number;
  /**
   * @example '00:09:28:24'
   */
  pickupTime: string;
  pushed: number;
  /**
   * @example '01:04:31:46'
   */
  reviewTime: string;
};
