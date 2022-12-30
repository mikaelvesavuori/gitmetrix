import { ParsedResultBasic } from '../interfaces/Parser';
import { Repository } from '../interfaces/Repository';

/**
 * @description Add a metric for "closed".
 */
export async function closedUsecase(repository: Repository, result: ParsedResultBasic) {
  await repository.addClosedPr(result);
}
