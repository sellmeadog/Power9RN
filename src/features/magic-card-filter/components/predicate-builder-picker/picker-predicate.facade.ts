import { useObservable, useObservableState } from 'observable-hooks';
import { useCallback } from 'react';
import { map } from 'rxjs/operators';

import { ID } from '@datorama/akita';

import { P9PickerTableSelection } from '../../../../components/picker-table/picker-table';
import { useDependency } from '../../../../core/di';
import { P9PickerPredicateExpression, P9Predicate } from '../../model/predicate';
import { P9MagicCardFilterQuery } from '../../state/magic-card-filter.query';
import { P9MagicCardFilterService } from '../../state/magic-card-filter.service';
import { P9MagicCardFilterStore } from '../../state/magic-card-filter.store';

export function usePickerPredicateBuilder(
  attribute: string,
): [
  expression: P9PickerTableSelection | undefined,
  canReset: boolean,
  toggle: (draft: P9Predicate<P9PickerPredicateExpression>) => void,
  reset: () => void,
] {
  const store = useDependency(P9MagicCardFilterStore);
  const query = useDependency(P9MagicCardFilterQuery);

  const expression$ = useObservable(() =>
    query
      .predicateMap(attribute)
      .pipe(
        map((hash) =>
          Object.values(hash!).reduce(
            (selection, predicate) => ({ ...selection, [predicate.expression.value]: predicate.expression.selected }),
            {} as P9PickerTableSelection,
          ),
        ),
      ),
  );

  const canReset$ = useObservable(() => expression$.pipe(map((expression) => Object.values(expression).some(Boolean))));

  const toggle = useCallback(
    (predicate: P9Predicate<P9PickerPredicateExpression>) => {
      store.update(attribute, (draft) => {
        if (predicate.expression.selected) {
          draft.predicates[predicate.id] = predicate;
        } else {
          delete draft.predicates[predicate.id];
        }
      });
    },
    [attribute, store],
  );

  const reset = useCallback(() => {
    store.update(attribute, (draft) => {
      draft.predicates = {};
    });
  }, [attribute, store]);

  return [useObservableState(expression$, {}), useObservableState(canReset$, false), toggle, reset];
}

export function usePickerPredicateEditor<E extends number | string = any>(
  attribute: string,
): [
  predicates: P9Predicate<E>[],
  update: (id: string, patch: Partial<P9Predicate<E>>) => void,
  remove: (id: string) => void,
] {
  const service = useDependency(P9MagicCardFilterService);
  const predicates = useObservableState(service.selectAttributePredicates(attribute), []);

  const update = useCallback(
    (id: ID, patch: Partial<P9Predicate<E>>) => {
      service.updatePredicate(attribute, id, patch);
    },
    [attribute, service],
  );

  const remove = useCallback(
    (id: ID) => {
      service.removePredicate(attribute, id);
    },
    [attribute, service],
  );

  return [predicates, update, remove];
}
