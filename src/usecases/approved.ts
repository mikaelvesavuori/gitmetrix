import { ParsedResultBasic } from '../interfaces/Parser';
import { Repository } from '../interfaces/Repository';

/**
 * @description Add an approval.
 */
export async function approvedUsecase(repository: Repository, result: ParsedResultBasic) {
  await repository.addApproval(result);
}
