/**
 * @description The Dynamo item that is to be destructured.
 */
export type Entry = [key: string, value: StringRepresentation];

/**
 * @description Representation of records in the database.
 */
export type DynamoItems = {
  Items: DynamoItem[];
};

/**
 * @description Record in the database.
 * @example {
 * chf: { N: '67' },
 * rt: { N: '11452' },
 * d: { N: '50' },
 * ad: { N: '67' },
 * pt: { N: '4124' },
 * cl: { N: '33' },
 * cm: { N: '40' },
 * m: { N: '29' },
 * chr: { N: '60' },
 * o: { N: '58' },
 * p: { N: '23' },
 * ap: { N: '22' },
 * sk: { S: '20221115' },
 * pk: { S: 'METRICS_SOMEORG/SOMEREPO' }
 * }
 */
export type DynamoItem = {
  [key: string]: StringRepresentation;
};

/**
 * @description String that represents the value.
 */
export type StringRepresentation = {
  S: string;
};
