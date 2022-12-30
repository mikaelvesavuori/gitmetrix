import { MetricInputDto } from './MetricInput';

/**
 * @description Parsers interpret incoming events into one the refined event types.
 */
export interface Parser {
  parse(input: MetricInputDto): ParsedResult[] | ParsedResultBasic[];
}

/**
 * @description Final parsed result from `Result` domain service.
 */
export type ParsedResult = {
  type: ResultType;
  date: EventDate;
  repoName: RepoName;
  change: ChangeType;
};

/**
 * @description Date in the format `YYYYMMDD`.
 */
export type EventDate = string;

/**
 * @description The name of the repository for which we are
 * measuring changes and performance.
 */
export type RepoName = string;

/**
 * @description Final parsed result from `Result` domain service
 * for simple changes that do not include a more complex change.
 */
export type ParsedResultBasic = Omit<ParsedResult, 'change'>;

/**
 * @description The type of result or change that we can measure.
 */
export type ResultType =
  | 'ReviewSize'
  | 'PickupTime'
  | 'ReviewTime'
  | 'Pushed'
  | 'Commented'
  | 'Opened'
  | 'Closed'
  | 'Merged'
  | 'Approved'
  | 'ChangesRequested';

/**
 * @description Parsed parameters from incoming webhook event.
 */
export type ParsedParamsOutput = {
  repoName: string;
  event: string;
  action: string;
  prState: string;
  mergeState: string;
  reviewState: string;
  issueState: string;
};

/**
 * @description The type of more complex change we are handling.
 */
export type ChangeType = ParsedReviewSize | ParsedPickupTime | ParsedReviewTime;

/**
 * @description The change object for a review size.
 */
export type ParsedReviewSize = {
  additions: number;
  changedFiles: number;
  deletions: number;
};

/**
 * @description The change for calculating a pickup time.
 */
export type ParsedPickupTime = number;

/**
 * @description The change for calculating a review time.
 */
export type ParsedReviewTime = number;
