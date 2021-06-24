import { useObservableState } from 'observable-hooks';
import { useCallback } from 'react';
import { Observable } from 'rxjs';
import { v1 } from 'uuid';

import { arrayAdd, arrayRemove, arrayUpdate, ID } from '@datorama/akita';

import { useDependency } from '../../../../core/di';
import { P9AttributePredicate, P9ComparisonOperator, P9LogicalOperator, P9Predicate } from '../../model/predicate';
import { P9MagicCardFilterQuery } from '../../state/magic-card-filter.query';
import { P9MagicCardFilterStore } from '../../state/magic-card-filter.store';

export function useGameplayStatPredicateBuilderFacade(): [
  predicates: P9Predicate<number>[],
  addPredicate: (attribute: string, expression: number) => void,
  updatePredicate: (id: ID, patch: Partial<P9Predicate<number>>) => void,
  removePredicate: (id: ID) => void,
] {
  const store = useDependency(P9MagicCardFilterStore);
  const query = useDependency(P9MagicCardFilterQuery);

  const predicates = useObservableState(
    query.predicateArray('gameplay.stats') as Observable<P9Predicate<number>[]>,
    [] as P9Predicate<number>[],
  );

  const addPredicate = useCallback(
    (attribute: string, expression: number) => {
      store.update('gameplay.stats', (draft: P9AttributePredicate<number>) => {
        const expressionX = expression === 6;

        (draft.predicates as P9Predicate<number>[]) = arrayAdd(draft.predicates as P9Predicate<number>[], {
          attribute,
          comparisonOperator: expressionX ? P9ComparisonOperator.GreaterThan : P9ComparisonOperator.Equal,
          expression: expressionX ? 5 : expression,
          id: v1(),
          logicalOperator: P9LogicalOperator.And,
        });
      });
    },
    [store],
  );

  const updatePredicate = useCallback(
    (id: ID, patch: Partial<P9Predicate<number>>) => {
      store.update('gameplay.stats', (draft: P9AttributePredicate<number>) => {
        (draft.predicates as P9Predicate<number>[]) = arrayUpdate(draft.predicates as P9Predicate<number>[], id, patch);
      });
    },
    [store],
  );

  const removePredicate = useCallback(
    (id: ID) => {
      store.update('gameplay.stats', (draft) => {
        draft.predicates = arrayRemove(draft.predicates, id);
      });
    },
    [store],
  );

  return [predicates, addPredicate, updatePredicate, removePredicate];
}
