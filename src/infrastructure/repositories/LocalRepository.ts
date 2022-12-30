import { Repository } from '../../interfaces/Repository';
import { MetricInput } from '../../interfaces/MetricInput';
import { CleanedItem } from '../../interfaces/Item';

import { getDateBefore } from '../frameworks/date';

import TestDatabase from '../../../testdata/data/TestDatabase.json';

/**
 * @description Factory function for local repository.
 */
export function createNewLocalRepository(): LocalRepository {
  return new LocalRepository();
}

/**
 * @description The local repo acts as a simple mock for testing and similar purposes.
 * The LocalRepo can optionally be initialized with custom test data, else will default
 * to a set of functional test data.
 */
class LocalRepository implements Repository {
  public async getMetrics(
    repoName: string,
    fromDate: string,
    toDate?: string
  ): Promise<CleanedItem[]> {
    if (!toDate) toDate = getDateBefore(true);

    return TestDatabase.filter((item: any) => {
      const timestamp: string = Object.keys(item)[0];
      const values: any = Object.values(item)[0];
      if (repoName === values.repoName && timestamp >= fromDate && toDate && timestamp <= toDate)
        return item;
    }) as unknown as CleanedItem[];
  }

  public async addPickupTime(input: MetricInput): Promise<void> {
    console.log(input);
  }

  public async addReviewSize(input: MetricInput): Promise<void> {
    console.log(input);
  }

  public async addReviewTime(input: MetricInput): Promise<void> {
    console.log(input);
  }

  public async addApproval(input: MetricInput): Promise<void> {
    console.log(input);
  }

  public async addChangesRequested(input: MetricInput): Promise<void> {
    console.log(input);
  }

  public async addClosedPr(input: MetricInput): Promise<void> {
    console.log(input);
  }

  public async addComment(input: MetricInput): Promise<void> {
    console.log(input);
  }

  public async addMergedPr(input: MetricInput): Promise<void> {
    console.log(input);
  }

  public async addOpenedPr(input: MetricInput): Promise<void> {
    console.log(input);
  }

  public async addPushed(input: MetricInput): Promise<void> {
    console.log(input);
  }
}
