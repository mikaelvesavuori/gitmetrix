import { ParsedResultBasic } from '../interfaces/Parser';
import { Repository } from '../interfaces/Repository';

/**
 * @description Add a metric for "merged".
 */
export async function mergedUseCase(repository: Repository, result: ParsedResultBasic) {
  await repository.addMergedPr(result);
}
