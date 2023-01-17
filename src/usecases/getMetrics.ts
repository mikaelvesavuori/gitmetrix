import { createNewMetrics } from '../domain/services/Metrics';

import { CleanedItem } from '../interfaces/Item';
import { Repository } from '../interfaces/Repository';
import { RequestDTO } from '../interfaces/Input';
import { MetricsResult } from '../interfaces/Metrics';

/**
 * @description Get metrics from persistence.
 */
export async function getMetrics(repository: Repository, input: RequestDTO) {
  const cachedMetrics = await getCachedMetricsFromDatabase(input, repository);
  if (cachedMetrics) return cachedMetrics;

  const metricsData = await getMetricsFromDatabase(input, repository);
  const metrics = compileResultMetrics(input, metricsData);

  await cacheMetrics(input, repository, metrics);

  return metrics;
}

/**
 * @description Get cached metrics from repository.
 */
async function getCachedMetricsFromDatabase(
  input: RequestDTO,
  repository: Repository
): Promise<MetricsResult | void> {
  const { repo, from, to } = input;

  const cachedData = await repository.getCachedMetrics({ key: repo, from: from, to: to });

  if (Object.keys(cachedData).length > 0) return cachedData;
}

/**
 * @description Get fresh metrics from repository.
 */
async function getMetricsFromDatabase(input: RequestDTO, repository: Repository) {
  const { repo, from, to } = input;

  return await repository.getMetrics({
    key: repo,
    from: from,
    to: to
  });
}

/**
 * @description Cache Metrics object in repository.
 */
async function cacheMetrics(input: RequestDTO, repository: Repository, metrics: MetricsResult) {
  const { repo, from, to } = input;

  await repository.cacheMetrics({ key: repo, range: `${from}_${to}`, metrics });
}

/**
 * @description Return final Metrics object.
 */
function compileResultMetrics(input: RequestDTO, metricsData: CleanedItem[]): MetricsResult {
  const { repo, from, to, offset } = input;

  const metrics = createNewMetrics();
  return metrics.makeMetrics({
    items: metricsData,
    repo,
    from,
    to,
    offset
  });
}
