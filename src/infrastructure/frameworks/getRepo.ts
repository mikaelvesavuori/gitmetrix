import { createNewDynamoRepository } from '../repositories/DynamoDbRepository';
import { createNewLocalRepository } from '../repositories/LocalRepository';

/**
 * @description Utility function that returns the correct type of persistence/repository.
 */
export function getRepo(isLocal: boolean) {
  if (isLocal) return createNewLocalRepository();
  return createNewDynamoRepository();
}
