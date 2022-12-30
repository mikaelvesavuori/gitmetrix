import { approvedUsecase } from '../usecases/approved';
import { changesRequestedUsecase } from '../usecases/changesRequested';
import { closedUsecase } from '../usecases/closed';
import { commentedUsecase } from '../usecases/commented';
import { mergedUseCase } from '../usecases/merged';
import { openedUsecase } from '../usecases/opened';
import { pushedUsecase } from '../usecases/pushed';
import { reviewedUsecase } from '../usecases/reviewed';
import { reviewPickedUpUsecase } from '../usecases/reviewPickedUp';
import { reviewTimeUsecase } from '../usecases/reviewTime';

import { ParsedResult, ParsedResultBasic } from '../interfaces/Parser'; // ParsedReviewTime
import { Repository } from '../interfaces/Repository';

/**
 * @description Handles webhook inputs and converts them
 * to our use cases. Input will be an array of one or more
 * parsed results to deal with.
 */
export async function mapResultToUsecase(
  parsedInputs: ParsedResult[] | ParsedResultBasic[],
  repo: Repository
) {
  await Promise.all(
    parsedInputs.map(async (parsedInput: ParsedResult | ParsedResultBasic) => {
      const { type } = parsedInput;

      if (type === 'Pushed') await pushedUsecase(repo, parsedInput);
      if (type === 'Commented') await commentedUsecase(repo, parsedInput);
      if (type === 'Opened') await openedUsecase(repo, parsedInput);
      if (type === 'Closed') await closedUsecase(repo, parsedInput);
      if (type === 'Merged') await mergedUseCase(repo, parsedInput);
      if (type === 'Approved') await approvedUsecase(repo, parsedInput);
      if (type === 'ChangesRequested') await changesRequestedUsecase(repo, parsedInput);
      if (type === 'PickupTime') await reviewPickedUpUsecase(repo, parsedInput as ParsedResult);
      if (type === 'ReviewTime') await reviewTimeUsecase(repo, parsedInput as ParsedResult);
      if (type === 'ReviewSize') await reviewedUsecase(repo, parsedInput as ParsedResult);
    })
  );

  return true;
}
