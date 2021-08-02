import { useObservableState } from 'observable-hooks';

import { P9UserDecklist } from '../../../core/data-user';
import { useDependency } from '../../../core/di';
import { P9DecklistExplorerQuery } from './decklist-explorer.query';

export function useUserDecklistExplorerFacade(): [
  state: { formatId: string; data: P9UserDecklist[] }[],
  // activate: (id: ID) => void,
  // remove: (entity: P9UserDecklist) => void,
] {
  const query = useDependency(P9DecklistExplorerQuery);

  return [useObservableState(query.decklistGroups$, [])];
}
