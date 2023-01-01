import { CleanedItem } from './Item';

/**
 * @description Input for making metrics
 */
export type MakeMetricsInput = {
  items: CleanedItem[];
  repoName: string;
  fromDate: string;
  toDate: string;
};

/**
 * @description The result of a metric.
 */
export type MetricsResult = {
  repo: string;
  period: TimePeriod;
  total: MetricSet;
  daily: DailyMetricSet;
  average: MetricSet;
};

/**
 * @description A period of time for a metric.
 */
export type TimePeriod = {
  from: string;
  to: string;
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
