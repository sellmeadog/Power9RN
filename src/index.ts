import 'react-native-get-random-values';
import 'reflect-metadata';

import { LogBox } from 'react-native';
import { enableScreens } from 'react-native-screens';

import { persistState } from './core/storage';

enableScreens();
persistState();

LogBox.ignoreLogs(['The Bundle Identifier or Application ID']);

export * from './app';
