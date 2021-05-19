import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { P9ThemeProvider } from './core/theme';
import { P9NavigationContainer } from './features';

export const App = () => {
  return (
    <SafeAreaProvider>
      <P9ThemeProvider>
        <P9NavigationContainer />
      </P9ThemeProvider>
    </SafeAreaProvider>
  );
};
