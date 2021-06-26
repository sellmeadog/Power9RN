import { useObservableState } from 'observable-hooks';
import { useCallback } from 'react';

import { useNavigation } from '@react-navigation/core';

import { useDependency } from '../../../core/di';
import { P9MagicCardFilterQuery } from '../state/magic-card-filter/magic-card-filter.query';
import { P9MagicCardFilterStore } from '../state/magic-card-filter/magic-card-filter.store';

export function useMagicCardFilterFacade(): [
  state: { predicate: string; canReset: boolean },
  reset: () => void,
  navigate: () => void,
] {
  const { navigate } = useNavigation();
  const store = useDependency(P9MagicCardFilterStore);
  const query = useDependency(P9MagicCardFilterQuery);

  return [
    {
      predicate: useObservableState(query.predicate$, ''),
      canReset: useObservableState(query.canReset$, false),
    },
    useCallback(() => store.reset(), [store]),
    useCallback(() => navigate('P9:MagicCardFilter'), [navigate]),
  ];
}
