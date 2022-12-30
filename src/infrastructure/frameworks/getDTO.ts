import { EventInput } from '../../interfaces/Aws';

/**
 * @description Get input Data Transfer Object (DTO)
 * from incoming Lambda/API Gateway `event` object.
 */
export function getDTO(input: EventInput) {
  return {
    repoName: input?.queryStringParameters?.repo,
    fromDate: input?.queryStringParameters?.from,
    toDate: input?.queryStringParameters?.to
  };
}
