/**
 * @description This error is fired when we cannot access an expected value
 * for the full name of the repository that triggered the webhook.
 */
export class MissingRepoNameError extends Error {
  constructor() {
    super();
    this.name = 'MissingRepoNameError';
    const message = `Input is missing the repository name!`;
    this.message = message;
    this.cause = {
      statusCode: 400
    };
  }
}

/**
 * @description This error is fired when the parser receives an
 * unknown/unexpected type of input.
 */
export class NoParsingMatchFoundError extends Error {
  constructor() {
    super();
    this.name = 'NoParsingMatchFoundError';
    const message = `No parsing was matched!`;
    this.message = message;
    this.cause = {
      statusCode: 400
    };
  }
}

/**
 * @description This error is fired when an unknown combination
 * of PR keys are encountered.
 */
export class NoPullRequestParsingMatchError extends Error {
  constructor() {
    super();
    this.name = 'NoPullRequestParsingMatchError';
    const message = `No match while parsing pull requests!`;
    this.message = message;
    this.cause = {
      statusCode: 400
    };
  }
}

/**
 * @description This error is fired when an unknown combination
 * of PR review keys are encountered.
 */
export class NoReviewParsingMatchError extends Error {
  constructor() {
    super();
    this.name = 'NoReviewParsingMatchError';
    const message = `No match while parsing reviews!`;
    this.message = message;
    this.cause = {
      statusCode: 400
    };
  }
}

/**
 * @description The error is fired when an unknown combination
 * of PR comment keys are encountered.
 */
export class NoCommentParsingMatchError extends Error {
  constructor() {
    super();
    this.name = 'NoCommentParsingMatchError';
    const message = `No match while parsing comments!`;
    this.message = message;
    this.cause = {
      statusCode: 400
    };
  }
}

/**
 * @description Missing required environment variables when setting up DynamoDB.
 */
export class MissingEnvironmentVariablesDynamoError extends Error {
  constructor() {
    super();
    this.name = 'MissingEnvironmentVariablesDynamoError';
    const message = `Missing required environment variables in DynamoDB!`;
    this.message = message;
    this.cause = {
      statusCode: 500
    };
  }
}

/**
 * @description Used when we are unable to match a mapped key to the provided key
 * when fetching data from our database.
 */
export class NoMappedKeyError extends Error {
  constructor() {
    super();
    this.name = 'NoMappedKeyError';
    const message = `No mapped key could be found!`;
    this.message = message;
    this.cause = {
      statusCode: 500
    };
  }
}

/**
 * @description Used when an expected `authorization` query string parameter is missing.
 */
export class MissingAuthorizationError extends Error {
  constructor() {
    super();
    this.name = 'MissingAuthorizationError';
    const message = `Missing an expected value in the "authorization" query string parameter!`;
    this.message = message;
    this.cause = {
      statusCode: 400
    };
  }
}

/**
 * @description Used when an incorrect authorization token is used.
 */
export class InvalidAuthTokenError extends Error {
  constructor() {
    super();
    this.name = 'InvalidAuthTokenError';
    const message = `The provided authorization token is incorrect.`;
    this.message = message;
    this.cause = {
      statusCode: 400
    };
  }
}

/**
 * @description Used when no parser could be mapped to the input.
 */
export class NoMatchingParserError extends Error {
  constructor() {
    super();
    this.name = 'NoMatchingParserError';
    const message = `No parser matched the input!`;
    this.message = message;
    this.cause = {
      statusCode: 400
    };
  }
}

/**
 * @description Used when a provided offset is not valid.
 */
export class InvalidOffsetError extends Error {
  constructor() {
    super();
    this.name = 'InvalidOffsetError';
    const message = 'Offset in hours must be provided as a number between -12 and 12!';
    this.message = message;
    //@ts-ignore
    this.cause = {
      statusCode: 400
    };
  }
}

/**
 * @description Used when all possible input query parameters are missing.
 */
export class MissingRequiredInputParamsError extends Error {
  constructor() {
    super();
    this.name = 'MissingRequiredInputParamsError';
    const message =
      'Unable to perform a query as either "to"/"from" or "last" parameters are missing.';
    this.message = message;
    //@ts-ignore
    this.cause = {
      statusCode: 500
    };
  }
}

/**
 * @description Used when a queried date is out of range.
 */
export class OutOfRangeQueryError extends Error {
  constructor() {
    super();
    this.name = 'OutOfRangeQueryError';
    const message = 'The queried date is out of range.';
    this.message = message;
    //@ts-ignore
    this.cause = {
      statusCode: 500
    };
  }
}

/**
 * @description Used when all mutually exclusive query parameters are used at the same time.
 */
export class TooManyInputParamsError extends Error {
  constructor() {
    super();
    this.name = 'TooManyInputParamsError';
    const message = 'To perform a query use either "to"/"from" or "last" parameters.';
    this.message = message;
    //@ts-ignore
    this.cause = {
      statusCode: 500
    };
  }
}
