import { ParsedResult } from '../interfaces/Parser';
import { Repository } from '../interfaces/Repository';

/**
 * @description Add metrics for pick-up time updates.
 */
export async function reviewPickedUpUsecase(repository: Repository, result: ParsedResult) {
  await repository.addPickupTime(result);
}
