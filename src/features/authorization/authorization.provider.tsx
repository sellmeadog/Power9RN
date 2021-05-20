import { useObservableState } from 'observable-hooks';
import React, { createContext, FunctionComponent, useContext, useLayoutEffect, useRef } from 'react';

import { P9AuthorizationQuery } from './state/authorization.query';
import { AuthError, makeP9AuthorizationService, P9AuthorizationService } from './state/authorization.service';
import { P9User } from './state/authorization.store';

type P9AuthorizationState = [query: P9AuthorizationQuery, service: P9AuthorizationService];

const P9AuthorizationContext = createContext<P9AuthorizationState | undefined>(undefined);

export interface P9AuthorizationProviderProps {}

export const P9AuthorizationProvider: FunctionComponent<P9AuthorizationProviderProps> = ({ children }) => {
  const state = useRef(makeP9AuthorizationService());

  useLayoutEffect(() => {
    const [_, service] = state.current;
    service.authorize();
  }, []);

  return <P9AuthorizationContext.Provider value={state.current}>{children}</P9AuthorizationContext.Provider>;
};

export function useAuthorizationFacade(): [
  state: { user: P9User; isAnonymous: boolean; error?: AuthError },
  authenticate: () => void,
] {
  const context = useContext(P9AuthorizationContext);

  if (context === undefined) {
    throw new Error('useAuthorizationFacade must be called within a P9AuthorizationProvider');
  }

  const [query, service] = context;

  return [
    {
      user: useObservableState(query.currentUser$, null),
      isAnonymous: useObservableState(query.isAnonymous$, true),
      error: useObservableState(query.selectError(), undefined),
    },
    service.authenticate,
  ];
}
