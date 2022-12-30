/**
 * @description Gets a lower-case normalized set of headers.
 */
export function getLowerCaseHeaders(headers: Record<string, any>) {
  const fixedHeaders: Record<string, any> = {};

  Object.entries(headers).map((header: string[]) => {
    const [key, value] = header;
    fixedHeaders[key.toLowerCase()] = value;
  });

  return fixedHeaders;
}
