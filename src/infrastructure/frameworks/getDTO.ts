/**
 * @description Get input Data Transfer Object (DTO)
 * from incoming Lambda/API Gateway `event` object.
 */
export function getDTO(input: Record<string, any>) {
  return {
    repoName: input.queryStringParameters?.repo,
    fromDate: input.queryStringParameters?.from,
    toDate: input.queryStringParameters?.to
  };
}
