import {
  DailyMetricSet,
  MakeMetricsInput,
  MetricSet,
  MetricsResult
} from '../../interfaces/Metrics';

import { prettifyTime, prettyTimeToSeconds } from '../../infrastructure/frameworks/time';
import { CleanedItem } from '../../interfaces/Item';

/**
 * @description Factory function to return new `Metrics` instance.
 */
export function createNewMetrics() {
  return new Metrics();
}

/**
 * @description Domain service for vending properly shaped `MetricsResult`s.
 */
class Metrics {
  /**
   * @description Create a valid `MetricsResult` DTO.
   */
  public makeMetrics(input: MakeMetricsInput): MetricsResult {
    const { items, repoName, fromDate, toDate } = input;

    const total = this.createTotalMetrics(items);
    const average = this.calculateAverages(total, items.length);
    const daily = this.createDailyMetrics(items);

    return {
      repo: repoName,
      period: {
        from: fromDate,
        to: toDate
      },
      total,
      average,
      daily
    };
  }

  /**
   * @description Creates the object to contain all daily metrics.
   */
  private createDailyMetrics(items: CleanedItem[]): DailyMetricSet {
    const daily: DailyMetricSet = {};

    items.forEach((item: CleanedItem) => {
      const innerObject: any = Object.values(item)[0];
      const dailyItem = {
        additions: this.getValue(innerObject, 'additions'),
        approved: this.getValue(innerObject, 'approved'),
        changedFiles: this.getValue(innerObject, 'changedFiles'),
        changesRequested: this.getValue(innerObject, 'changesRequested'),
        closed: this.getValue(innerObject, 'closed'),
        comments: this.getValue(innerObject, 'comments'),
        deletions: this.getValue(innerObject, 'deletions'),
        merged: this.getValue(innerObject, 'merged'),
        opened: this.getValue(innerObject, 'opened'),
        pickupTime: this.getValue(innerObject, 'pickupTime', true),
        pushed: this.getValue(innerObject, 'pushed'),
        reviewTime: this.getValue(innerObject, 'reviewTime', true)
      };

      const timestamp = Object.keys(item)[0];
      // @ts-ignore
      daily[timestamp] = dailyItem;
    });

    return daily;
  }

  /**
   * @description Creates the object to contain total, aggregate metrics.
   */
  private createTotalMetrics(items: CleanedItem[]): MetricSet {
    return {
      additions: this.reduceToNumber(items, 'additions'),
      approved: this.reduceToNumber(items, 'approved'),
      changedFiles: this.reduceToNumber(items, 'changedFiles'),
      changesRequested: this.reduceToNumber(items, 'changesRequested'),
      closed: this.reduceToNumber(items, 'closed'),
      comments: this.reduceToNumber(items, 'comments'),
      deletions: this.reduceToNumber(items, 'deletions'),
      merged: this.reduceToNumber(items, 'merged'),
      opened: this.reduceToNumber(items, 'opened'),
      pickupTime: this.reduceTime(items, 'pickupTime'),
      pushed: this.reduceToNumber(items, 'pushed'),
      reviewTime: this.reduceTime(items, 'reviewTime')
    };
  }

  /**
   * @description Creates the object to contain averaged metrics for the current time span.
   */
  private calculateAverages(total: MetricSet, count: number): MetricSet {
    const {
      additions,
      approved,
      changedFiles,
      changesRequested,
      closed,
      comments,
      deletions,
      merged,
      opened,
      pickupTime,
      pushed,
      reviewTime
    } = total;

    return {
      additions: this.getAverageValue(additions, count),
      approved: this.getAverageValue(approved, count),
      changedFiles: this.getAverageValue(changedFiles, count),
      changesRequested: this.getAverageValue(changesRequested, count),
      closed: this.getAverageValue(closed, count),
      comments: this.getAverageValue(comments, count),
      deletions: this.getAverageValue(deletions, count),
      merged: this.getAverageValue(merged, count),
      opened: this.getAverageValue(opened, count),
      pickupTime: this.getAverageTime(pickupTime, count),
      pushed: this.getAverageValue(pushed, count),
      reviewTime: this.getAverageTime(reviewTime, count)
    };
  }

  /**
   * @description Get the average value (by dividing a value with a number).
   */
  private getAverageValue(value: number, count: number) {
    return Math.round(value / count);
  }

  /**
   * @description Get the average time (by dividing a "prettified" time value with a number).
   */
  private getAverageTime(value: string, count: number) {
    const seconds = prettyTimeToSeconds(value);
    if (seconds > 0) return prettifyTime(Math.round(seconds / count));
    return value;
  }

  /**
   * @description Get a value from an object at a provided key.
   *
   * Also coerces any non-time values into numbers as databases such as DynamoDB will store items as strings.
   */
  private getValue(item: Record<string, any>, key: string, isTime = false): number | string {
    const fallback = isTime ? '00:00:00:00' : 0;
    const value: number | string = isTime ? item[key] : parseInt(item[key]);
    return value || fallback;
  }

  /**
   * @description Reduces a set of numbers into an aggregate value.
   *
   * Also coerces any input into numbers as databases such as DynamoDB will store items as strings.
   */
  private reduceToNumber(items: Record<string, any>[], key: string): number {
    return items.reduce((previousValue: number, currentValue: Record<string, any>) => {
      const value: string = currentValue[Object.keys(currentValue)[0]][key];
      if (value) return previousValue + parseInt(value);
      return parseInt(previousValue as unknown as string);
    }, 0);
  }

  /**
   * @description Reduces a set of prettified time values (`00:00:00:00` format) into seconds,
   * and then returns it as a prettified value again.
   */
  private reduceTime(items: Record<string, any>[], key: string): string {
    const value =
      items.reduce((previousValue: number, currentValue: Record<string, any>) => {
        const value = prettyTimeToSeconds(currentValue[Object.keys(currentValue)[0]][key]);
        if (value) return previousValue + value;
        return previousValue;
      }, 0) || 0;

    return prettifyTime(value);
  }
}
