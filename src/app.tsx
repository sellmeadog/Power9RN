import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { P9ThemeProvider } from './core/theme';
import { P9AuthorizationProvider } from './features/authorization';
import { P9NavigationContainer } from './features/navigation';

export const P9App = () => {
  return (
    <SafeAreaProvider>
      <P9AuthorizationProvider>
        <P9ThemeProvider>
          <P9NavigationContainer />
        </P9ThemeProvider>
      </P9AuthorizationProvider>
    </SafeAreaProvider>
  );
};
