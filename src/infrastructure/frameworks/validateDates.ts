/**
 * @description Checks if dates are valid. Runs:
 * - Length check
 * - Should only be numbers
 * - The "from date" must be before "to date"
 */
export function validateDates(fromDate: string, toDate?: string) {
  if (!fromDate) return false;

  if (checkLength(fromDate)) return false;
  if (checkOnlyNumbers(fromDate)) return false;

  if (toDate) {
    if (checkLength(toDate)) return false;
    if (checkOnlyNumbers(toDate)) return false;
    if (fromDate >= toDate) return false;
  }

  return true;
}

const checkLength = (date: string): boolean => date.length !== 8;
const checkOnlyNumbers = (date: string): boolean => !/^\d+$/.test(date);
