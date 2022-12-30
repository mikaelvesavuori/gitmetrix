import { Repository } from './Repository';

/**
 * @description Input object when getting metrics.
 */
export type GetMetricsInput = {
  repository: Repository;
  repoName: string;
  fromDate: string;
  toDate?: string;
};
