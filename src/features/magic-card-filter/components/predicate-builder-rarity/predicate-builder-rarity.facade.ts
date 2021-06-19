import { useObservable, useObservableState } from 'observable-hooks';
import { useCallback } from 'react';
import { map } from 'rxjs/operators';

import { P9MagicCardRarity } from '../../../../components';
import { useDependency } from '../../../../core/di';
import { P9LogicalOperator } from '../../model/predicate';
import { P9MagicCardFilterQuery } from '../../state/magic-card-filter.query';
import { P9MagicCardFilterStore } from '../../state/magic-card-filter.store';

export function useMagicCardRarityPredicateBuilderFacade(): [
  state: { selection: { [key: string]: boolean }; canReset: boolean },
  toggle: (rarity: P9MagicCardRarity, selected: boolean) => void,
] {
  const store = useDependency(P9MagicCardFilterStore);
  const query = useDependency(P9MagicCardFilterQuery);

  const selection$ = useObservable(() =>
    query
      .predicateMap('rarity')
      .pipe(
        map((hash) =>
          Object.values(hash!).reduce(
            (selection, predicate) => ({ ...selection, [predicate.expression.value]: predicate.expression.selected }),
            {},
          ),
        ),
      ),
  );

  return [
    {
      selection: useObservableState(selection$, {}),
      canReset: useObservableState(selection$.pipe(map((selection) => Object.values(selection).some(Boolean))), false),
    },
    useCallback(
      (key: P9MagicCardRarity, value: boolean) =>
        store.update('rarity', (draft) => {
          if (value) {
            draft.predicates[key] = {
              attribute: 'rarity',
              id: key,
              logicalOperator: P9LogicalOperator.Or,
              expression: { value: key, selected: value },
            };
          } else {
            delete draft.predicates[key];
          }
        }),
      [store],
    ),
  ];
}
