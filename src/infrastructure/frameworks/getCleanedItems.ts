import { DynamoItem, Entry, StringRepresentation } from '../../interfaces/DynamoDb';
import { CleanedItem } from '../../interfaces/Item';

import { prettifyTime } from './time';

import { NoMappedKeyError } from '../../application/errors';

/**
 * @description Clean up and return items in a normalized `CleanedItem` format.
 */
export function getCleanedItems(items: DynamoItem[]): CleanedItem[] {
  if (items && items.length > 0) return items.map((item: DynamoItem) => createCleanedItem(item));
  return [];
}

/**
 * @description Produce an object with a cleaned and restored format based on the input data.
 */
function createCleanedItem(item: DynamoItem): CleanedItem {
  const sk: [string, StringRepresentation] = Object.entries(item).filter(
    ([key]) => key === 'sk'
  )[0];
  const date: string = sk[1]['S'];
  const cleanedItem: Record<string, any> = {
    [date]: {}
  };

  Object.entries(item).forEach((entry: Entry) => {
    const [key, value] = entry;
    if (key === 'pk' || key === 'sk') return;
    const mappedKey = getMappedKey(key);
    const val = Object.values(value)[0];
    const fixedValue = key === 'pt' || key === 'rt' ? prettifyTime(parseInt(val)) : val;
    cleanedItem[date][mappedKey] = fixedValue;
  });

  return cleanedItem as CleanedItem;
}

/**
 * @description Utility to fetch the long-form, human-readable
 * key name based on the storage-optimized keys we use in the database.
 */
function getMappedKey(key: string): string {
  const mapping: Record<string, any> = {
    chf: 'changedFiles',
    rt: 'reviewTime',
    d: 'deletions',
    ad: 'additions',
    pt: 'pickupTime',
    cl: 'closed',
    cm: 'comments',
    m: 'merged',
    chr: 'changesRequested',
    o: 'opened',
    p: 'pushed',
    ap: 'approved'
  };

  const mappedKey: string = mapping[key];
  if (!mappedKey) throw new NoMappedKeyError();

  return mappedKey;
}
