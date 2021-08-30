import React, { FunctionComponent } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { P9ApolloProvider } from './core/apollo';
import { useAuthorizationManager } from './core/authorization';
import { usePurchasesSetup } from './core/purchases';
import { P9ThemeProvider } from './core/theme';
import { P9NavigationContainer } from './features/navigation';
import { P9PartitionProvider } from './features/public/components';

export const P9AppShell: FunctionComponent = () => {
  useAuthorizationManager();
  usePurchasesSetup();

  return (
    <SafeAreaProvider>
      <P9ApolloProvider>
        <P9PartitionProvider>
          <P9ThemeProvider>
            <P9NavigationContainer />
          </P9ThemeProvider>
        </P9PartitionProvider>
      </P9ApolloProvider>
    </SafeAreaProvider>
  );
};
