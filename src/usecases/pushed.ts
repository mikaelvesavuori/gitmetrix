import { ParsedResultBasic } from '../interfaces/Parser';
import { Repository } from '../interfaces/Repository';

/**
 * @description Add a metric for "pushed".
 */
export async function pushedUsecase(repository: Repository, result: ParsedResultBasic) {
  await repository.addPushed(result);
}
