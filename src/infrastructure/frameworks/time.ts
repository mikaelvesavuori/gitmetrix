/**
 * @description Get the difference in seconds between two moments in time (i.e. Unix timestamps).
 */
export const getDiffInSeconds = (earlierTime: number, laterTime: number): number =>
  Math.floor((laterTime - earlierTime) / 1000);

/**
 * @description Returns a prettified time format (`DD:HH:MM:SS`) from a count of seconds.
 * All fields will be double-digit, but it is possible that double-digit `DD` will in fact
 * be three-digit `DDD` if the day count is huge (i.e. over 99).
 */
export function prettifyTime(timeInSeconds: number): string {
  if (!timeInSeconds) return '00:00:00:00';

  let days = Math.floor(timeInSeconds / 86400).toString();
  if (days.length === 1) days = `0` + days;

  let hours = Math.floor((timeInSeconds % 86400) / 3600).toString();
  if (hours.length === 1) hours = `0` + hours;

  let minutes = Math.floor((timeInSeconds % 3600) / 60).toString();
  if (minutes.length === 1) minutes = `0` + minutes;

  let seconds = Math.floor((timeInSeconds % 3600) % 60).toString();
  if (seconds.length === 1) seconds = `0` + seconds;

  return `${days}:${hours}:${minutes}:${seconds}`;
}

/**
 * @description Converts Zulu time (GMT +0) to Unix timestamp.
 */
export function zuluToUnix(zuluTime: string) {
  return new Date(zuluTime).getTime();
}

/**
 * @description Converts a prettified time to a numberic count of seconds
 * to represent the same value.
 * @example prettyTimeToSeconds('00:09:28:24')
 */
export function prettyTimeToSeconds(time: string) {
  if (!time || time === '00:00:00:00') return 0;

  const [days, hours, minutes, seconds] = time.split(':');
  return (
    parseInt(days) * 86400 + parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)
  );
}
