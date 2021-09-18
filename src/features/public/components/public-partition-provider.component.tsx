import { useObservableState } from 'observable-hooks';
import React, { createContext, FunctionComponent, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { Results, User } from 'realm';

import { useAuthorizedUser } from '../../../core/authorization';
import { P9UserDataPartitionService } from '../../../core/data-user/state/user-data-partition.service';
import { useDependency } from '../../../core/di';
import { P9MagicCardObject } from '../../../core/public';
import { P9PublicPartitionService } from '../../../core/public/state/public-partition.service';
import { P9MagicCardGalleryQuery } from '../../magic-cards/state/magic-card.query';
import { P9MagicCardGalleryStateTuple, P9MagicCardGalleryStore } from '../../magic-cards/state/magic-card.store';

const P9PartitionContext = createContext<{ magicCardGallery: P9MagicCardGalleryStateTuple } | undefined>(undefined);

export interface P9PartitionProviderProps {}

export const P9PartitionProvider: FunctionComponent<P9PartitionProviderProps> = ({ children }) => {
  const { user } = useAuthorizedUser();
  const publicDataService = useDependency(P9PublicPartitionService);
  const galleryRef = useRef<P9MagicCardGalleryStateTuple>([
    useDependency(P9MagicCardGalleryStore),
    useDependency(P9MagicCardGalleryQuery),
  ]);
  const userDataService = useDependency(P9UserDataPartitionService);

  useEffect(() => {
    if (!user?.isLoggedIn) {
      return;
    }

    publicDataService.open(user as any as User);
    userDataService.open(user as any as User);

    return () => {
      publicDataService.close();
      userDataService.close();
    };
  }, [publicDataService, user, userDataService]);

  const state = useMemo(() => ({ magicCardGallery: galleryRef.current }), []);

  return <P9PartitionContext.Provider value={state}>{children}</P9PartitionContext.Provider>;
};

export function useMagicCardGalleryFacade(): [
  state: { keywordExpression?: string; visibleResults?: Results<P9MagicCardObject> },
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
  const visibleResults = useObservableState(query.visibleResults$, [] as unknown as Results<P9MagicCardObject>);

  const setKeywordExpression = useCallback(
    (expression: string) => store.update((state) => ({ ...state, keywordExpression: expression })),
    [store],
  );

  return [{ keywordExpression, visibleResults }, setKeywordExpression];
}
