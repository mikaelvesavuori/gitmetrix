import { ChangeType, ParsedResult, ParsedResultBasic, ResultType } from './Parser';

/**
 * @description Produces valid `ParsedResult` or `ParsedResultBasic` objects.
 */
export interface ResultService {
  produceResult(resultServiceInput: ResultServiceInput): ParsedResult | ParsedResultBasic;
  setRepoName(repoName: string): void;
}

/**
 * @description The input to a `ResultService` instance.
 */
export type ResultServiceInput = {
  type: ResultType;
  change?: ChangeType;
};
