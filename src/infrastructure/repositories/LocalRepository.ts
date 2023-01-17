import { CacheRequest, DataRequest, Repository } from '../../interfaces/Repository';
import { MetricsResult } from '../../interfaces/Metrics';
import { CleanedItem } from '../../interfaces/Item';
import { ParsedResult, ParsedResultBasic } from '../../interfaces/Parser';

import { getTestData, getCachedTestData } from '../../../testdata/database/LocalTestDatabase';

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
  public async getMetrics(dataRequest: DataRequest): Promise<CleanedItem[]> {
    const { key, to, from } = dataRequest;
    return getTestData(key, to, from) as CleanedItem[];
  }

  public async getCachedMetrics(dataRequest: DataRequest): Promise<MetricsResult> {
    const { key, to, from } = dataRequest;
    return getCachedTestData(key, from, to) as MetricsResult;
  }

  public async cacheMetrics(cacheRequest: CacheRequest): Promise<void> {
    console.log(cacheRequest);
  }

  public async addApproval(input: ParsedResultBasic): Promise<void> {
    console.log(input);
  }

  public async addChangesRequested(input: ParsedResultBasic): Promise<void> {
    console.log(input);
  }

  public async addClosedPr(input: ParsedResultBasic): Promise<void> {
    console.log(input);
  }

  public async addComment(input: ParsedResultBasic): Promise<void> {
    console.log(input);
  }

  public async addMergedPr(input: ParsedResultBasic): Promise<void> {
    console.log(input);
  }

  public async addOpenedPr(input: ParsedResultBasic): Promise<void> {
    console.log(input);
  }

  public async addPushed(input: ParsedResultBasic): Promise<void> {
    console.log(input);
  }

  public async addPickupTime(input: ParsedResult): Promise<void> {
    console.log(input);
  }

  public async addReviewSize(input: ParsedResult): Promise<void> {
    console.log(input);
  }

  public async addReviewTime(input: ParsedResult): Promise<void> {
    console.log(input);
  }
}
