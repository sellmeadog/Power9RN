import React, { FunctionComponent } from 'react';

import { P9AppShell } from './app-shell';
import { P9DependencyContainerProvider } from './core/di';

export const P9App: FunctionComponent = () => {
  return (
    <P9DependencyContainerProvider>
      <P9AppShell />
    </P9DependencyContainerProvider>
  );
};
