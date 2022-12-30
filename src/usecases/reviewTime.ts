import { ParsedResult } from '../interfaces/Parser';
import { Repository } from '../interfaces/Repository';

/**
 * @description Add metrics for review time updates.
 */
export async function reviewTimeUsecase(repository: Repository, result: ParsedResult) {
  await repository.addReviewTime(result);
}
