import 'react-native-get-random-values';
import 'reflect-metadata';

import { enableScreens } from 'react-native-screens';

import { persistState } from './core/storage';

enableScreens();
persistState();

export * from './app';
