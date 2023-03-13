/**
 * @description Simplified representation of AWS Lambda `event` object.
 */
export type EventInput = {
  body: Record<string, any>;
  headers: Headers;
  queryStringParameters: Record<string, any>;
  requestContext?: RequestContext;
  identitySource: string[];
};

/**
 * @description Simplified headers object.
 */
export type Headers = {
  'User-Agent': string;
  Authorization?: string;
};

type RequestContext = {
  http: {
    method: string;
  };
};
