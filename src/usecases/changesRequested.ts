import { ParsedResultBasic } from '../interfaces/Parser';
import { Repository } from '../interfaces/Repository';

/**
 * @description Add a "change requested" metric.
 */
export async function changesRequestedUsecase(repository: Repository, result: ParsedResultBasic) {
  await repository.addChangesRequested(result);
}
