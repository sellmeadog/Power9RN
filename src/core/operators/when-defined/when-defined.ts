import { OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Filters all null or undefined values from the source stream and publishes all
 * other values including 0, false and empty string.
 */
export const whenDefined = <T>(): OperatorFunction<T | null | undefined, T> =>
  filter((value): value is T => !(value === null || value === undefined));
