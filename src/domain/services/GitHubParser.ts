import {
  Parser,
  ParsedParamsOutput,
  ParsedResult,
  ParsedResultBasic
} from '../../interfaces/Parser';
import { ResultService } from '../../interfaces/Result';
import { MetricInputDto } from '../../interfaces/MetricInput';

import { getDiffInSeconds, zuluToUnix } from '../../infrastructure/frameworks/time';

import {
  MissingRepoNameError,
  NoCommentParsingMatchError,
  NoParsingMatchFoundError,
  NoPullRequestParsingMatchError,
  NoReviewParsingMatchError
} from '../../application/errors';

/**
 * @description Parser that is adapted for GitHub webhooks.
 */
export class GitHubParser implements Parser {
  resultService: ResultService;

  constructor(resultService: ResultService) {
    this.resultService = resultService;
  }

  /**
   * @description Parses webhook input into the major, high-level use-cases.
   */
  public parse(input: MetricInputDto): ParsedResult[] | ParsedResultBasic[] {
    const params = this.getParams(input);
    const { repoName, event } = params;

    if (!repoName) throw new MissingRepoNameError();
    this.resultService.setRepoName(repoName);

    if (event === 'push') return this.parsePushes();
    else if (event === 'issue_comment') return this.parseComments(params);
    else if (event === 'pull_request') return this.parsePullRequests(input, params);
    else if (event === 'pull_request_review') return this.parseReviews(input, params);
    throw new NoParsingMatchFoundError();
  }

  /**
   * @description Retrieves required parameters from webhook input.
   */
  private getParams(input: MetricInputDto): ParsedParamsOutput {
    const repoName: string = input['body']?.['repository']?.['full_name'] || '';
    const event: string =
      input['headers']?.['x-github-event'] || input['headers']?.['X-GitHub-Event'] || '';
    const action: string = input['body']?.['action'] || '';
    const prState: string = input['body']?.['pull_request']?.['state'] || '';
    const mergeState: string = input['body']?.['pull_request']?.['merged'] || '';
    const reviewState: string = input['body']?.['review']?.['state'] || '';
    const issueState: string = input['body']?.['issue']?.['state'] || '';

    return { repoName, event, action, prState, mergeState, reviewState, issueState };
  }

  /**
   * @description Parse `push` use cases.
   *
   * Cases:
   * - Code pushed
   */
  private parsePushes(): ParsedResultBasic[] {
    const results: Record<string, any> = [];
    results.push(this.resultService.produceResult({ type: 'Pushed' }));
    return results.filter((result: ParsedResult | ParsedResultBasic) => result);
  }

  /**
   * @description Parse `issue_comment` use cases.
   *
   * Cases:
   * - PR issue comment created
   */
  private parseComments(params: ParsedParamsOutput): ParsedResultBasic[] {
    const { action } = params;
    const results: Record<string, any> = [];

    if (action === 'created') results.push(this.resultService.produceResult({ type: 'Commented' }));
    else throw new NoCommentParsingMatchError();

    return results.filter((result: ParsedResult | ParsedResultBasic) => result);
  }

  /**
   * @description Parse `pull_request` use cases.
   *
   * Cases:
   * - PR opened
   * - PR ready for review (?)
   * - PR closed
   */
  private parsePullRequests(
    input: MetricInputDto,
    params: ParsedParamsOutput
  ): ParsedResult[] | ParsedResultBasic[] {
    const { action, prState, mergeState } = params;
    const results: Record<string, any> = [];

    // PR state: Open
    if (prState === 'open') {
      if (action === 'ready_for_review') {
        results.push(this.handleReviewSize(input));
      } else if (action === 'opened') {
        results.push(this.resultService.produceResult({ type: 'Opened' }));
      }
    }
    // PR state: Closed
    else if (prState === 'closed' && action === 'closed') {
      if (mergeState) results.push(this.resultService.produceResult({ type: 'Merged' }));
      results.push(this.resultService.produceResult({ type: 'Closed' }));
      // If this is simply closed, then we have no `merged_at` time
      if (
        input['body']['pull_request']['merged_at'] &&
        input['body']['pull_request']['review_comments'] > 0
      )
        results.push(this.handleReviewTime(input));
    } else throw new NoPullRequestParsingMatchError();

    return results.filter((result: ParsedResult | ParsedResultBasic) => result);
  }

  /**
   * @description Parse `pull_request_review` use cases.
   *
   * Cases:
   * - PR review approved
   * - PR review changes requested
   */
  private parseReviews(
    input: MetricInputDto,
    params: ParsedParamsOutput
  ): ParsedResult[] | ParsedResultBasic[] {
    const { action, reviewState } = params;
    const results: Record<string, any> = [];

    if (action === 'submitted') {
      const type = (() => {
        if (reviewState === 'approved') return 'Approved';
        if (reviewState === 'changes_requested') return 'ChangesRequested';
        throw new NoReviewParsingMatchError();
      })();

      results.push(this.resultService.produceResult({ type: type }));
      results.push(this.handlePickupTime(input));
    } else throw new NoReviewParsingMatchError();

    return results.filter((result: ParsedResult | ParsedResultBasic) => result);
  }

  /**
   * @description Utility for building a correct review size data object.
   */
  private handleReviewSize(input: MetricInputDto): ParsedResult {
    const additions: number = input['body']['pull_request']['additions'];
    const changedFiles: number = input['body']['pull_request']['changed_files'];
    const deletions: number = input['body']['pull_request']['deletions'];

    return this.resultService.produceResult({
      type: 'ReviewSize',
      change: {
        additions,
        changedFiles,
        deletions
      }
    }) as ParsedResult;
  }

  /**
   * @description Utility for building a correct pickup time data object.
   */
  private handlePickupTime(input: MetricInputDto): ParsedResult {
    const createdAt = zuluToUnix(input['body']['pull_request']['created_at']);
    const submittedAt = zuluToUnix(input['body']['review']['submitted_at']);

    return this.resultService.produceResult({
      type: 'PickupTime',
      change: getDiffInSeconds(createdAt, submittedAt)
    }) as ParsedResult;
  }

  /**
   * @description Utility for building a correct review time data object.
   */
  private handleReviewTime(input: MetricInputDto): ParsedResult {
    const submittedAt = zuluToUnix(input['body']['pull_request']['created_at']);
    const mergedAt = zuluToUnix(input['body']['pull_request']['merged_at']);

    return this.resultService.produceResult({
      type: 'ReviewTime',
      change: getDiffInSeconds(submittedAt, mergedAt)
    }) as ParsedResult;
  }
}
