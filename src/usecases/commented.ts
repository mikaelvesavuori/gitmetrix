import { ParsedResultBasic } from '../interfaces/Parser';
import { Repository } from '../interfaces/Repository';

/**
 * @description Add a metric for "commented".
 */
export async function commentedUsecase(repository: Repository, result: ParsedResultBasic) {
  await repository.addComment(result);
}
