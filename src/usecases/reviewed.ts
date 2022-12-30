import { ParsedResult } from '../interfaces/Parser';
import { Repository } from '../interfaces/Repository';

/**
 * @description Add metrics for a review size update.
 */
export async function reviewedUsecase(repository: Repository, result: ParsedResult) {
  await repository.addReviewSize(result);
}
