/**
 * @description Creates the IAM policy for the response.
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
 */
export const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string,
  data: string | Record<string, any>
) => {
  return {
    principalId,
    context: {
      stringKey: JSON.stringify(data)
    },
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  };
};
