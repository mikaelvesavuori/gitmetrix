# `gitmetrix` 🚀 🧑‍🚀 🧑🏿‍🚀 🧑🏻‍🚀 👩‍🚀 📈

![Build Status](https://github.com/mikaelvesavuori/gitmetrix/workflows/main/badge.svg) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=mikaelvesavuori_gitmetrix&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=mikaelvesavuori_gitmetrix) [![CodeScene Code Health](https://codescene.io/projects/33250/status-badges/code-health)](https://codescene.io/projects/33250) [![CodeScene System Mastery](https://codescene.io/projects/33250/status-badges/system-mastery)](https://codescene.io/projects/33250) [![codecov](https://codecov.io/gh/mikaelvesavuori/gitmetrix/branch/main/graph/badge.svg?token=1VZWBO88Q8)](https://codecov.io/gh/mikaelvesavuori/gitmetrix) [![Maintainability](https://api.codeclimate.com/v1/badges/adb152e805d9447c83b2/maintainability)](https://codeclimate.com/github/mikaelvesavuori/gitmetrix/maintainability)

## Helps you find your team-level engineering metrics from GitHub.

---

With `gitmetrix` you get the possibility to extract a set of core Git metrics ("engineering metrics") for a given repository and time span:

```json
{
  "product": "ORG/REPO",
  "period": {
    "from": "20221228",
    "to": ""
  },
  "total": {
    "additions": 0,
    "approved": 0,
    "changedFiles": 0,
    "changesRequested": 0,
    "closed": 3,
    "comments": 2,
    "deletions": 0,
    "merged": 0,
    "opened": 1,
    "pickupTime": "00:00:00:00",
    "pushed": 5,
    "reviewTime": "00:01:01:31"
  },
  "average": {
    "additions": 0,
    "approved": 0,
    "changedFiles": 0,
    "changesRequested": 0,
    "closed": 2,
    "comments": 1,
    "deletions": 0,
    "merged": 0,
    "opened": 1,
    "pickupTime": "00:00:20:00",
    "pushed": 3,
    "reviewTime": "00:00:30:46"
  },
  "daily": {
    "20221228": {
      "additions": 0,
      "approved": 0,
      "changedFiles": 0,
      "changesRequested": 0,
      "closed": 2,
      "comments": 2,
      "deletions": 0,
      "merged": 0,
      "opened": 1,
      "pickupTime": "00:00:00:00",
      "pushed": 3,
      "reviewTime": "00:00:00:00"
    },
    "20221229": {
      "additions": 0,
      "approved": 0,
      "changedFiles": 0,
      "changesRequested": 0,
      "closed": 1,
      "comments": 0,
      "deletions": 0,
      "merged": 0,
      "opened": 0,
      "pickupTime": "00:00:20:00",
      "pushed": 2,
      "reviewTime": "00:01:01:31"
    }
  }
}
```

Or in plain English, for each day:

- How many times is code pushed?
- How many pull requests are opened?
- How many pull requests are closed?
- How many pull requests are merged?
- How many code reviews are approved?
- How many code reviews are closed?
- How many code review comments are made?

It also helps you get some more interesting metrics:

- **Review size**: How many additions/deletions/files changed are there in a pull request that is "ready for review"?
- **Pick-up time**: How long does it take to start doing a code review, from "ready for review" to "review submitted"?
- **Review time**: How long does a code review take, from a review being completed to the commit being merged/closed?

And it's all quite simple: Just deploy `gitmetrix` and pass your repository's GitHub webhooks to it!

## How `gitmetrix` works

Like [dorametrix](https://github.com/mikaelvesavuori/dorametrix), `gitmetrix` is a serverless web service that collects and represents specific delivery-related webhook events sent to it, which are then stored in a database. As a user, you can request these metrics which are calculated from those same stored events.

**Because all metrics are stored beginning on the date at which you start sending webhook events to `gitmetrix` you will not be able to retrieve statistics from any time before that.**

`gitmetrix` **currently integrates only through GitHub via webhooks and is adapted (out-of-the-box) for an AWS environment**. See the [Support](#support) section for more details — it's not impossible getting it to work in other clouds or Git providers!

## Need even more metrics?

**Looking for DORA metrics?** Then consider [dorametrix](https://github.com/mikaelvesavuori/dorametrix).

**Looking for Individual Contributor metrics from GitHub?** Then consider [this simple Gist](https://gist.github.com/mikaelvesavuori/a0b75f0ebc617e20caab42a2b25c66f3) as a basis.

---

## Prerequisites

- Recent [Node.js](https://nodejs.org/en/) (ideally 18+) installed.
- Amazon Web Services (AWS) account with sufficient permissions so that you can deploy infrastructure. A naive but simple policy would be full rights for CloudWatch, Lambda, API Gateway, DynamoDB, and S3.
- Ideally, some experience with [Serverless Framework](https://www.serverless.com) as that's what we will use to deploy the service and infrastructure.
- You will need to deploy the stack before working with it locally as it uses actual infrastructure even in local mode.

## Installation

Clone, fork, or download the repo as you normally would. Run `npm install`.

## Commands

The below commands are the most critical ones. See `package.json` for more commands! Substitute `npm` for `yarn` or whatever floats your boat.

- `npm start`: Run Serverless Framework in offline mode
- `npm test`: Run tests on the codebase
- `npm run deploy`: Deploy with Serverless Framework
- `npm run build`: Package and build the code with Serverless Framework
- `npm run teardown`: Removes the deployed stack

## Configuration

### Application settings

#### Required

- `custom.config.accountNumber`: Your AWS account number.
- `custom.config.authToken`: The "API key" or authorization token you want to use to secure your service. You will use this when calling the service.

Note that all unit tests use a separate authorization token that you don't have to care about in regular use.

#### Optional

- `custom.config.tableName`: This defaults to `gitmetrix` but can be changed.

#### Environment variables

- `REGION`: The AWS region you want to use. Takes the value from `provider.region`.
- `TABLE_NAME`: The DynamoDB table name you want to use. Takes the value from `custom.config.tableName`.
- `AUTH_TOKEN`: Only available in the authorizer function. Takes the value from `custom.config.authToken`.

## Running locally

Run `npm start`.

Note that it will attempt to connect to a database, so deploy the application and infrastructure before any local development.

## Testing

Run `npm run test` to run all unit tests.

### Create test data

If you want a bit of test data to toy around with, run `npm run test:createdata`. You can modify the settings of the test data creation by modifying the constants in `tests/createTestData.ts`. This is especially important if you have changed the region of the deployment or the name of the table.

**Note that all primary keys for test data are generated with `SOMEORG/SOMEREPO` as the repository name.**

## Deployment

Run `npm run deploy`.

## Logging and metrics

`gitmetrix` uses [mikrolog](https://github.com/mikaelvesavuori/mikrolog) and [mikrometric](https://github.com/mikaelvesavuori/mikrometric) for logging and metrics respectively.

Logs will have a richly structured format and metrics for cached and uncached reads will be output to CloudWatch Logs (using Embedded Metrics Format, under the covers). See the below image for a basic example of how you can see the number of uncached vs cached reads in CloudWatch.

![Example of metrics in CloudWatch](readme/metrics.png)

## Creating the GitHub webhook

Create a webhook in your repository's `Settings` page. Under the `Code and automation` pane, you should see `Webhooks`. _[See this guide if you need more exact instructions](https://docs.github.com/en/developers/webhooks-and-events/webhooks/creating-webhooks)_.

For `Payload URL`—assuming you are using the default API endpoint—add your endpoint and auth token in the general format of

```
https://RANDOM.execute-api.REGION.amazonaws.com/STAGE/AddMetrics?authorization=AUTH_TOKEN
```

Next, set the content type to `application/json`, skip secrets, make sure SSL is enabled, and select the following event types to trigger the webhook:

- `Issue comments`
- `Pull requests`
- `Pull request reviews`
- `Pushes`

_Note that not all of the individual fine-grained events are actually used, but the above four represent the four overall categories or types we need_.

### Note on security

Normally, if possible, you should use [GitHub webhook secrets](https://docs.github.com/en/developers/webhooks-and-events/webhooks/securing-your-webhooks). These need to be verified against a hash constructed based on the request body and a secret. The "secret" is provided by you so this is easy enough to do, but in AWS the Lambda Authorizer will not have access to the request body. This makes it practically unfeasible to implement webhook secrets — for AWS, at least in this way.

The approach used in `gitmetrix` is instead to make the best of the situation and:

1. Require an `authorization` query string parameter which is verified by a [Lambda Authorizer function](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html), and
2. Check for the presence of an `X-GitHub-Event` header.

The authorization only happens when adding metrics and not for getting metrics. This is of course customizable if you'd like. See `serverless.yml` around line 57 for more.

This approach adds a minimal security measure but is flexible enough to also work effortlessly with any integration tests you might want to run. At the end of the day an acceptable compromise solution, I hope.

_Consider making a pull request, starting an Issue, or otherwise informing of your interest in this, if it's important to you or if you have ideas for resolving this in a good way._

## Using the service

### Example request

Get metrics for a specific interval:

```bash
GET {BASE_URL}/GetMetrics?repo=myservice&from=20221020&to=20221027
```

| Parameter | Required | Format     | Example                     |  Description                                                     |
| --------- | -------- | ---------- | --------------------------- | ---------------------------------------------------------------- |
| `repo`    | Yes      | `ORG/REPO` | `mikaelvesavuori/gitmetrix` | Name of repository to get metrics for                            |
| `from`    | Yes      | `YYYYMMDD` | `20221020`                  | Set a specific period to start from                              |
| `to`      | No       | `YYYYMMDD` | `20221020`                  | Set a specific period to end with (defaults to yesterday's date) |

### Example response

```json
{
  // Dynamically set by the response
  "product": "ORG/REPO",
  "period": {
    "from": "20221228",
    "to": ""
  },
  // Retrieved metrics
  "total": {
    "additions": 0,
    "approved": 0,
    "changedFiles": 0,
    "changesRequested": 0,
    "closed": 3,
    "comments": 2,
    "deletions": 0,
    "merged": 0,
    "opened": 1,
    "pickupTime": "00:00:20:00",
    "pushed": 5,
    "reviewTime": "00:01:01:31"
  },
  "average": {
    "additions": 0,
    "approved": 0,
    "changedFiles": 0,
    "changesRequested": 0,
    "closed": 2,
    "comments": 1,
    "deletions": 0,
    "merged": 0,
    "opened": 1,
    "pickupTime": "00:00:10:00",
    "pushed": 3,
    "reviewTime": "00:00:30:46"
  },
  "daily": {
    // For all days...
    "20221228": {
      "additions": 0,
      "approved": 0,
      "changedFiles": 0,
      "changesRequested": 0,
      "closed": 2,
      "comments": 2,
      "deletions": 0,
      "merged": 0,
      "opened": 1,
      "pickupTime": "00:00:00:00",
      "pushed": 3,
      "reviewTime": "00:00:00:00"
    },
    "20221229": {
      "additions": 0,
      "approved": 0,
      "changedFiles": 0,
      "changesRequested": 0,
      "closed": 1,
      "comments": 0,
      "deletions": 0,
      "merged": 0,
      "opened": 0,
      "pickupTime": "00:00:20:00",
      "pushed": 2,
      "reviewTime": "00:01:01:31"
    }
  }
}
```

---

## Details on the technical implementation

### Anonymous data

`gitmetrix` does not collect, store, or process any details on a given individual and their work. All data is strictly anonymous and aggregated. You should feel entirely confident that nothing invasive is happening with the data handled with `gitmetrix`.

### What about the authorization token in the query string parameter?

This is a totally normal and acceptable way of passing the value. However, the value could potentially be logged by intermediary layers. `gitmetrix` does nothing with the value and it's unlikely that there is anything in the AWS infrastructure-as-code that logs the value either.

### Metrics and history

The granularity of metrics collection is on the daily level, in the format `YYYYMMDD` (e.g. `20221020`). While you can get a range of dates, you can't get more exact responses than a full day.

**The most recent date you can get metrics for is the day prior, i.e. "yesterday"**. The reason for this is partly because it makes no real sense to get incomplete datasets, as well as because `gitmetrix` caches all data requests. Caching a dataset with incomplete data would not be very good.

### Time

#### Time zone used

This uses GMT/Zulu time.

#### How timestamps are set

Timestamps are set internally in `gitmetrix` and generated on the current local time of the backend service/function.

**This should be fine for most circumstances but will possibly be inaccurate if you have teams that are very widely distributed**, in which case certain events may be posted to the wrong date.

I haven't consolidated on a specific approach as being "good enough" while also being dynamic and easy to grok. While I acknowledge this as a small limitation, in reality, it may not be that meaningful given that you are looking at aggregate team performance over longer periods than one or two days.

_If you have a proposal for a solution that you think makes sense, please consider making a pull request, raising an Issue, or otherwise communicating how this could be fixed in a coming release of `gitmetrix`._

### Database design

| Primary Key          | Secondary Key | Attribute names |
| -------------------- | ------------- | --------------- |
| `METRICS_{ORG/REPO}` | `{YYYYMMDD}`  | See below       |

Attribute names are shortened and may look a bit mysterious, but it's really just about optimizing them to the smallest values so that they don't eat unnecessary bandwidth, especially if you are fetching longer periods.

The below outlines all of the attributes on a given day such as `20221020`:

| Attribute | Type    |  Description           |
| --------- | ------- | ---------------------- |
|  `pk`     | String  | Primary key (system)   |
|  `sk`     | String  | Sort key (system)      |
|  `p`      | Number  | Pushed                 |
|  `o`      | Number  | Opened                 |
|  `m`      | Number  | Merged                 |
|  `cl`     | Number  | Closed                 |
|  `cm`     | Number  | Commented              |
|  `ap`     | Number  | Approved               |
|  `chr`    | Number  | Changes requested      |
|  `ad`     | Number  | Additions              |
|  `chf`    | Number  | Changed files          |
|  `d`      | Number  | Deletions              |
|  `pt`     | Number  | Pickup time in seconds |
|  `rt`     | Number  | Review time in seconds |

Metrics are [incremented atomically](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithItems.html#WorkingWithItems.AtomicCounters).

### Caching

On any given metrics retrieval request, `gitmetrix` will behave in one of two ways:

- **Cached filled**: Return the cached content.
- **Cache empty**: Query > Store response in cache > Return response.

Caching is always done for a range of dates. All subsequent lookups will use the cached data only if the exact same "from" and "to" date ranges are cached.

| Primary Key                 | Secondary Key           | Value (example)           |
| --------------------------- | ----------------------- | ------------------------- |
| `METRICS_CACHED_{ORG/REPO}` | `{FROM_DATE}_{TO_DATE}` | `Items` array of response |

## How the metrics are calculated

The majority of metrics are very simple additions to numeric counts. Beyond these basic ones, there are also a few that need to do a bit more, ending up with 2 or more calculations for a single change.

The basic ones are:

| Add +1 to | When                      |
| --------- | ------------------------- |
|  `p`      | Code is pushed            |
|  `m`      | Code is merged            |
|  `o`      | GitHub Issue is opened    |
|  `cl`     | GitHub Issue is closed    |
|  `cm`     | GitHub Issue gets comment |

The somewhat more complicated ones are detailed below.

### Review size (PR size)

_Known when a PR review is opened/requested_.

Measures the number of concrete file-level changes in files for a given PR review.

#### Matches:

| Webhook        | Action             | PR State |
| -------------- | ------------------ | -------- |
| `pull_request` | `ready_for_review` | `open`   |

#### Affects:

| Attribute | Description   |
| --------- | ------------- |
|  `ad`     | Additions     |
|  `chf`    | Changed files |
|  `d`      | Deletions     |

Adds the numeric values from `body.pull_request.additions`, `body.pull_request.deletions`, and `body.pull_request.changed_files` to their current daily values.

### Pick-up time

_Known when a review is approved or changes are requested_.

Measures the time from opening a PR to submitting the first PR review (i.e. approving or requesting changes).

#### When a change is approved - Matches:

| Webhook               | Action      | Review State |
| --------------------- | ----------- | ------------ |
| `pull_request_review` | `submitted` | `approved`   |

#### When a change is approved - Affects:

| Attribute | Description                     |
| --------- | ------------------------------- |
|  `pt`     | Pickup time                     |
|  `ap`     | Pull request review is approved |

#### When changes are requested - Matches:

| Webhook               | Action      | Review State        |
| --------------------- | ----------- | ------------------- |
| `pull_request_review` | `submitted` | `changes_requested` |

#### When changes are requested - Affects:

| Attribute | Description                                  |
| --------- | -------------------------------------------- |
|  `pt`     | Pickup time                                  |
|  `chr`    | Pull request review gets "Changes requested" |

Compares the diff between `body.pull_request.created_at` and `body.review.submitted_at` and adds this difference in seconds to the current value of `PICKUP_TIME_{ORG/REPO}`.

### Review time

_Known when a PR is closed and we have some merge and comment activity to measure._

Measures the time from the initial PR code review to when the PR is merged. While technically we don't need PR comments, without them effectively we can't infer a review even took place. This is imperfect but better than not having such a safeguard.

#### Matches:

| Webhook        | Action   | PR State | Conditions                                                                                  |
| -------------- | -------- | -------- | ------------------------------------------------------------------------------------------- |
| `pull_request` | `closed` | `closed` | `body.pull_request.merged_at` is not empty, i.e. it's not just closed, it's actually merged |
|                |          |          | `body.pull_request.review_comments` is more than zero                                       |

#### Affects:

| Attribute | Description             |
| --------- | ----------------------- |
|  `rt`     | Review time             |
|  `m`      | Merged (only if merged) |
|  `c`      | Closed                  |

Compares the diff between `body.pull_request.created_at` and `body.pull_request.merged_at`.

---

## Diagrams

### Solution diagram

_As it stands currently, `gitmetrix` is implemented in an AWS-oriented manner. This should be fairly easy to modify so it works with other cloud platforms and with other persistence technologies. If there is sufficient demand, I might add extended support. Or you do it! Just make a PR and I'll see how we can proceed._

!["gitmetrix diagram"](./diagrams/gitmetrix-diagram.png)

### Code flow diagram

The below diagram is generated by [Madge](https://github.com/pahen/madge).

!["gitmetrix code diagram"](./diagrams/code-diagram.svg)

Please see the [generated documentation site](https://gitmetrix.pages.dev) for more detailed information.

---

## Support

### What about more Git integrations?

`gitmetrix` **currently integrates only through GitHub via webhooks**. The internal logic however allows for extending with any number of "parsers" that are specific to any version control software (VCS) such as Bitbucket or Azure DevOps. Ideally, to function similarly, the VCS should support webhooks so the experience is equivalent to the current state of `gitmetrix`.

_Consider making a pull request, starting an Issue, or otherwise informing of your interest in this, if it's important to you or if you have ideas for resolving this in a good way._

### What about using a non-AWS stack?

That's absolutely doable!

The code is already prepared to be extensible for other databases (repositories) and other compute solutions than AWS Lambda. You could relatively easily make the changes by adding a repository to handle the concrete implementation details of your chosen database and adding some other variant of the wrapping handler functions, while still being able to use all the same internal logic. Except for these bigger details, there might be smaller stuff we need to take care of to make `gitmetrix` truly support more platforms—but none of this is a real blocker.

_Consider making a pull request, starting an Issue, or otherwise informing of your interest in this, if it's important to you or if you have ideas for resolving this in a good way._

---

## Ideas for improvements

- "Direct parser", for straight API calls rather than using webhooks?
- Replace dates (`20221030`) with some type of normalized Unix timestamp?
- Get a dynamic response ("sliding window"): `{BASE_URL}/GetMetrics?repo=myservice&last=7`
- "Coding time metric", measuring the time between an initial commit and when a PR is ready to review?
- Integration and system tests?

---

## References

- [GitHub: Webhook events and payloads](https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads)
