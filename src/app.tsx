import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { P9ApolloProvider } from './core/apollo';
import { P9DependencyContainerProvider } from './core/di';
import { P9ThemeProvider } from './core/theme';
import { P9AuthorizationProvider } from './features/authorization';
import { P9NavigationContainer } from './features/navigation';
import { P9PartitionProvider } from './features/public/components';

export const P9App = () => {
  return (
    <SafeAreaProvider>
      <P9AuthorizationProvider>
        <P9ApolloProvider>
          <P9DependencyContainerProvider>
            <P9PartitionProvider>
              <P9ThemeProvider>
                <P9NavigationContainer />
              </P9ThemeProvider>
            </P9PartitionProvider>
          </P9DependencyContainerProvider>
        </P9ApolloProvider>
      </P9AuthorizationProvider>
    </SafeAreaProvider>
  );
};
