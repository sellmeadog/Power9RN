export const simplify = (value: string | undefined) => {
  return value?.replace(/[-]/g, ' ').replace(/[^\s\w]/g, '');
};
