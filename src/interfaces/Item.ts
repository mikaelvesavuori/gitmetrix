/**
 * @description Represents the valid and complete data of a
 * correctly shaped and cleaned Item entity.
 */

/**
 * @description Final ready-to-use item.
 */
export type CleanedItem = {
  [date: string]: {
    repoName: string;
    additions: number;
    approved: number;
    changedFiles: number;
    changesRequested: number;
    closed: number;
    comments: number;
    deletions: number;
    merged: number;
    opened: number;
    pickupTime: string;
    pushed: number;
    reviewTime: string;
  };
};
