/**
 * @description The combined input object of both headers
 * and an object body as a single piece.
 */
export type MetricInputDto = {
  body: Record<string, any>;
  headers: Record<string, any>;
};
