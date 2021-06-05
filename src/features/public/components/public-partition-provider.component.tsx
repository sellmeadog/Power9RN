import { useObservableState } from 'observable-hooks';
import React, { createContext, FunctionComponent, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { Results } from 'realm';

import { P9MagicCard } from '../../../core/public';
import { makePublicPartitionService } from '../../../core/public/state/public-partition.service';
import { useAuthorizationFacade } from '../../authorization';
import { useMagicCardFilterQuery } from '../../magic-card-filter';
import { makeMagicCardGalleryStore, P9MagicCardGalleryStateTuple } from '../../magic-cards/state/magic-card.store';

const P9PartitionContext = createContext<{ magicCardGallery: P9MagicCardGalleryStateTuple } | undefined>(undefined);

export interface P9PartitionProviderProps {}

export const P9PartitionProvider: FunctionComponent<P9PartitionProviderProps> = ({ children }) => {
  const [{ user }] = useAuthorizationFacade();
  const serviceRef = useRef(makePublicPartitionService());
  const galleryRef = useRef(makeMagicCardGalleryStore(serviceRef.current[0], useMagicCardFilterQuery()));

  useEffect(() => {
    if (!user || !user.isLoggedIn) {
      return;
    }

    const [_, service] = serviceRef.current;
    service.open(user);

    return () => {
      service.close();
    };
  }, [user]);

  const state = useMemo(() => ({ magicCardGallery: galleryRef.current }), []);

  return <P9PartitionContext.Provider value={state}>{children}</P9PartitionContext.Provider>;
};

export function useMagicCardGalleryFacade(): [
  state: { keywordExpression?: string; visibleResults?: Results<P9MagicCard> },
  setKeywordExpression: (expression: string) => void,
] {
  const context = useContext(P9PartitionContext);

  if (context === undefined) {
    throw new Error('useMagicCardGalleryFacade must be called within a P9PartitionProvider');
  }

  const {
    magicCardGallery: [store, query],
  } = context;
  const keywordExpression = useObservableState(query.keywordExpression$, undefined);
  const visibleResults = useObservableState(query.visibleResults$, undefined);

  const setKeywordExpression = useCallback(
    (expression: string) => store.update((state) => ({ ...state, keywordExpression: expression })),
    [store],
  );

  return [{ keywordExpression, visibleResults }, setKeywordExpression];
}
