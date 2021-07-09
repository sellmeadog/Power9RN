import { useObservableState } from 'observable-hooks';
import React, { createContext, FunctionComponent, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { Results } from 'realm';

import { P9UserDataPartitionService } from '../../../core/data-user/state/user-data-partition.service';
import { useDependency } from '../../../core/di';
import { P9MagicCard } from '../../../core/public';
import { P9PublicPartitionQuery } from '../../../core/public/state/public-partition.query';
import { P9PublicPartitionService } from '../../../core/public/state/public-partition.service';
import { useAuthorizationFacade } from '../../authorization';
import { P9MagicCardFilterQuery } from '../../magic-card-filter/state/magic-card-filter/magic-card-filter.query';
import { makeMagicCardGalleryStore, P9MagicCardGalleryStateTuple } from '../../magic-cards/state/magic-card.store';

const P9PartitionContext = createContext<{ magicCardGallery: P9MagicCardGalleryStateTuple } | undefined>(undefined);

export interface P9PartitionProviderProps {}

export const P9PartitionProvider: FunctionComponent<P9PartitionProviderProps> = ({ children }) => {
  const [{ user }] = useAuthorizationFacade();
  const publicDataService = useDependency(P9PublicPartitionService);
  const galleryRef = useRef(
    makeMagicCardGalleryStore(useDependency(P9PublicPartitionQuery), useDependency(P9MagicCardFilterQuery)),
  );
  const userDataService = useDependency(P9UserDataPartitionService);

  useEffect(() => {
    if (!user || !user.isLoggedIn) {
      return;
    }

    publicDataService.open(user);
    userDataService.open(user);

    return () => {
      publicDataService.close();
      userDataService.close();
    };
  }, [publicDataService, user, userDataService]);

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
