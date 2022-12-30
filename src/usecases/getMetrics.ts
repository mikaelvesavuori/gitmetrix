import { createNewMetrics } from '../domain/services/Metrics';

import { GetMetricsInput } from '../interfaces/GetMetrics';
import { CleanedItem } from '../interfaces/Item';

import { validateDates } from '../infrastructure/frameworks/validateDates';

import { InvalidDateError, MissingRepoNameError } from '../application/errors';

/**
 * @description Get metrics from persistence.
 */
export async function getMetricsUsecase(input: GetMetricsInput) {
  const { repository, repoName, fromDate } = input;

  if (!repoName) throw new MissingRepoNameError();
  if (!validateDates(fromDate, input.toDate)) throw new InvalidDateError();

  const dbMetrics: CleanedItem[] = await repository.getMetrics(repoName, fromDate, input.toDate);
  if (!dbMetrics || dbMetrics.length === 0) return [];

  const metrics = createNewMetrics();
  return metrics.makeMetrics({
    items: dbMetrics,
    repoName,
    fromDate,
    toDate: input.toDate || ''
  });
}
