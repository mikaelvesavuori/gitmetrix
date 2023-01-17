import { getParser } from '../application/getParser';
import { mapResultToUsecase } from '../application/mapResultToUsecase';

import { MetricInputDto } from '../interfaces/MetricInput';

import { getLowerCaseHeaders } from '../infrastructure/frameworks/getLowerCaseHeaders';
import { getRepo } from '../infrastructure/frameworks/getRepo';

/**
 * @description Add one or more metrics.
 */
export async function addMetric(input: MetricInputDto) {
  const headers: Record<string, any> = getLowerCaseHeaders(input.headers || {});
  input.headers = headers;

  const parser = getParser(input.headers);
  const parsedInputs = parser.parse(input);
  const repo = getRepo(process.env.NODE_ENV === 'test');
  await mapResultToUsecase(parsedInputs, repo);
}
