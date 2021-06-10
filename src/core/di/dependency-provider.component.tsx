import React, { createContext, FunctionComponent, useContext, useRef } from 'react';
import { container, DependencyContainer, InjectionToken } from 'tsyringe';

const P9DependencyContainerContext = createContext<DependencyContainer | undefined>(undefined);

export interface P9DependencyContainerProviderProps {}

export const P9DependencyContainerProvider: FunctionComponent<P9DependencyContainerProviderProps> = ({ children }) => {
  return <P9DependencyContainerContext.Provider value={container}>{children}</P9DependencyContainerContext.Provider>;
};

export function useDependency<T>(token: InjectionToken<T>): T {
  const context = useContext(P9DependencyContainerContext);

  if (context === undefined) {
    throw new Error('useDependency must be called within a P9DependencyContainerProvider');
  }

  const { current } = useRef(context.resolve<T>(token));
  return current;
}
