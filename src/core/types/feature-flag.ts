import { ReactElement } from 'react';
import Environment from 'react-native-config';

export type FeatureFlag = keyof typeof Environment;

export const FEATURE_FLAG = (flag: FeatureFlag): boolean => {
  return Environment[flag] === 'on' ? true : false;
};

export const withFlag = <T extends ReactElement>(flag: keyof typeof Environment, element: T): T | null => {
  return Environment[flag] === 'on' ? element : null;
};

export const useFeatureFlag = (...flags: (keyof typeof Environment)[]): boolean[] => {
  return flags.map(FEATURE_FLAG);
};
