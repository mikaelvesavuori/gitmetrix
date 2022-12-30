/**
 * @description Utility function to create a valid AWS Lambda return object.
 */
export function end(statusCode = 201, message?: Record<string, any> | number | string) {
  if (!message) message = '';

  return {
    statusCode,
    body: JSON.stringify(message)
  };
}
