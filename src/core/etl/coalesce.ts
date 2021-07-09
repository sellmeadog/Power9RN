export function coalesce<T>(...values: T[]): NonNullable<T> | null {
  for (let index = 0; index < values.length; index++) {
    const value: any = values[index];

    if (value === '' || value === false || value === 0 || !!value) {
      return value;
    }
  }

  return null;
}
