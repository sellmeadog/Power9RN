import { useObservable, useObservableState } from 'observable-hooks';
import { useCallback } from 'react';
import { switchMap } from 'rxjs/operators';

import { useDependency } from '../../../core/di';
import { P9ColorPredicateExpression, P9Predicate, P9StringOperator } from '../model/predicate';
import { P9MagicCardFilterQuery } from './magic-card-filter.query';
import { P9MagicCardFilterStore } from './magic-card-filter.store';

export function useMagicCardFilterQuery() {
  return useDependency(P9MagicCardFilterQuery);
}

export function useMagicCardColorPredicateBuilder(): [
  predicate: P9Predicate<P9ColorPredicateExpression> | undefined,
  update: (draft: Partial<P9ColorPredicateExpression>) => void,
] {
  const store = useDependency(P9MagicCardFilterStore);
  const query = useDependency(P9MagicCardFilterQuery);

  const [predicate] = useObservableState(
    () => query.colorPredicate$,
    () =>
      ({
        attribute: 'card_faces.colors',
        expression: { fuzziness: 0 },
        id: 'card_faces.colors',
      } as P9Predicate<P9ColorPredicateExpression>),
  );

  const update = useCallback(
    (expression: Partial<P9ColorPredicateExpression>) =>
      //@ts-ignore
      store.upsert(
        'card_faces.colors',
        //@ts-ignore
        (state) => ({ ...state, expression: { ...state.expression, ...expression } }),
        (id, state) => ({ attribute: 'card_faces.colors', id, ...state }),
      ),
    [store],
  );

  return [predicate, update];
}

export function useMagicCardStringPredicateBuilder(
  attribute: string,
): [
  predicates: P9Predicate<string>[] | undefined,
  parser: (expression: string, stringOperator: P9StringOperator) => void,
  reset: () => void,
] {
  const store = useDependency(P9MagicCardFilterStore);
  const query = useDependency(P9MagicCardFilterQuery);

  return [
    useObservableState(
      useObservable(
        (attribute$) => attribute$.pipe(switchMap(([attribute_]) => query.forAttribute(attribute_))),
        [attribute],
      ),
    ),
    useCallback(
      (expression: string, stringOperator: P9StringOperator) =>
        store.parseStringExpression(attribute, expression, stringOperator),
      [attribute, store],
    ),
    useCallback(() => store.removePerAttribute(attribute), [attribute, store]),
  ];
}

export function useMagicCardStringPredicateEditor(
  id: string,
): [predicate: P9Predicate | undefined, update: (draft: Partial<P9Predicate>) => void, remove: () => void] {
  const store = useDependency(P9MagicCardFilterStore);
  const query = useDependency(P9MagicCardFilterQuery);

  return [
    useObservableState(useObservable((id$) => id$.pipe(switchMap(([id_]) => query.selectEntity(id_))), [id])),
    useCallback((draft: Partial<P9Predicate>) => store.update(id, draft), [id, store]),
    useCallback(() => store.remove(id), [id, store]),
  ];
}

export function useMagicCardFilterPredicate(): [predicate: string | undefined, reset: () => void] {
  const store = useDependency(P9MagicCardFilterStore);
  const query = useDependency(P9MagicCardFilterQuery);

  const [predicate] = useObservableState(() => query.predicate$, undefined);
  const reset = useCallback(() => store.remove(), [store]);

  return [predicate, reset];
}
