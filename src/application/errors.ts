/**
 * @description This error is fired when we cannot access an expected value
 * for the full name of the repository that triggered the webhook.
 */
export class MissingRepoNameError extends Error {
  constructor() {
    super();
    this.name = 'MissingRepoNameError';
    const message = `Input is missing the repo name in the "full_name" field!`;
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
 * @description The error is fired when provided dates won't validate.
 */
export class InvalidDateError extends Error {
  constructor() {
    super();
    this.name = 'InvalidDateError';
    const message = `Invalid dates passed in! Please verify the provided dates.`;
    this.message = message;
    this.cause = {
      statusCode: 400
    };
  }
}

/**
 * @description The error is fired when a start date occurs before an end date.
 */
export class InvalidDateOrderError extends Error {
  constructor() {
    super();
    this.name = 'InvalidDateOrderError';
    const message = `Start date is before end date!`;
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
export class MissingAuthorizationQueryStringParameterError extends Error {
  constructor() {
    super();
    this.name = 'MissingAuthorizationQueryStringParameterError';
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
 * @description Used when an incompatible date unit is encountered.
 */
export class InvalidDateUnitError extends Error {
  constructor() {
    super();
    this.name = 'InvalidDateUnitError';
    const message = `Incorrect date unit, must be 'day' or 'month'!`;
    this.message = message;
    this.cause = {
      statusCode: 400
    };
  }
}
