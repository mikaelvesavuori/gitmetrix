import { getCurrentDate, getTimestampForInputDate } from 'chrono-utils';

import { ParsedResult, ParsedResultBasic } from '../../interfaces/Parser';
import { ResultService, ResultServiceInput } from '../../interfaces/Result';

/**
 * @description Factory function that returns a new `Result` domain service.
 */
export function createNewResultService() {
  return new Result();
}

/**
 * @description The `Result` domain service produces ready-to-use, parsed results.
 */
class Result implements ResultService {
  timestamp: string;
  repo = '';

  constructor() {
    /**
     * The date is set internally rather than from GH webhook data as it's not
     * completely clear which fields will be authoritative in every case.
     *
     * The time zone will be normalized to UTC/GMT+0/Zulu time ("London time").
     *
     * Further, the delay should normally be in the span of a few seconds so
     * any latency will most likely be very minor.
     */
    this.timestamp = getTimestampForInputDate(getCurrentDate(true));
  }

  /**
   * @description Returns a well-defined, final parsed result (and change) for an input event.
   *
   */
  public produceResult(input: ResultServiceInput): ParsedResult | ParsedResultBasic {
    const { type } = input;
    const result: Record<string, any> = {
      type,
      timestamp: this.timestamp,
      repo: this.repo
    };

    if (input.change) {
      result['change'] = input.change;
      return result as ParsedResult;
    }

    return result as ParsedResultBasic;
  }

  /**
   * @description Sets the repository name to use in the `Result` class.
   */
  public setRepoName(repoName: string) {
    this.repo = repoName;
  }
}
