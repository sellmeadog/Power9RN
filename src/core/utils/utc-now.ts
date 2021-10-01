import { DateTime } from 'luxon';

export function UTC_NOW(): number {
  return Math.floor(DateTime.utc().toSeconds());
}
