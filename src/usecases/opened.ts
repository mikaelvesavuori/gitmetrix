import { ParsedResultBasic } from '../interfaces/Parser';
import { Repository } from '../interfaces/Repository';

/**
 * @description Add a metric for "opened".
 */
export async function openedUsecase(repository: Repository, result: ParsedResultBasic) {
  await repository.addOpenedPr(result);
}
