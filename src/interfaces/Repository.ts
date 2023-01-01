import { CleanedItem } from './Item';
import { MetricInput } from './MetricInput';
import { ParsedResult, RepoName } from './Parser';

/**
 * @description Describes what a repository (database implementation)
 * has to conform to.
 */
export interface Repository {
  /**
   * @description Get metrics for a given repository and a period of time.
   *
   * @param {RepoName} repo Name of the repository
   * @param {string} fromDate Date in the form `YYYYMMDD` or `20201030`
   * @param {string} [toDate] Date in the form `YYYYMMDD` or `20201030`
   */
  getMetrics(repo: RepoName, fromDate: string, toDate?: string): Promise<CleanedItem[]>;

  addApproval(input: MetricInput): Promise<void>;
  addChangesRequested(input: MetricInput): Promise<void>;
  addClosedPr(input: MetricInput): Promise<void>;
  addComment(input: MetricInput): Promise<void>;
  addMergedPr(input: MetricInput): Promise<void>;
  addOpenedPr(input: MetricInput): Promise<void>;
  addPushed(input: MetricInput): Promise<void>;

  addPickupTime(result: ParsedResult): Promise<void>;
  addReviewSize(result: ParsedResult): Promise<void>;
  addReviewTime(result: ParsedResult): Promise<void>;
}
