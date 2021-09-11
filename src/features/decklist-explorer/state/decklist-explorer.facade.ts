import { useObservable, useObservableState } from 'observable-hooks';
import { combineLatest } from 'rxjs';

import { P9UserDecklist } from '../../../core/data-user';
import { useDependency } from '../../../core/di';
import { P9DecklistExplorerQuery } from './decklist-explorer.query';

export interface P9UserDecklistGroup {
  formatId: string;
  data: P9UserDecklist[][];
}

export interface P9UserDecklistExplorerState {
  decklistCount: number;
  decklistGroups: P9UserDecklistGroup[];
}

export function useUserDecklistExplorerFacade(): [state: P9UserDecklistExplorerState] {
  const query = useDependency(P9DecklistExplorerQuery);

  return [
    useObservableState(
      useObservable(() =>
        combineLatest({ decklistCount: query.decklistCount$, decklistGroups: query.decklistGroups$ }),
      ),
      { decklistCount: 0, decklistGroups: [] },
    ),
  ];
}
