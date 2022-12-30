import { EventDate, RepoName } from './Parser';

/**
 * @description Input object when using a repository.
 */
export type MetricInput = {
  repoName: RepoName;
  date: EventDate;
};

/**
 * @description The combined input object of both headers
 * and an object body as a single piece.
 */
export type MetricInputDto = {
  body: Record<string, any>;
  headers: Record<string, any>;
};
