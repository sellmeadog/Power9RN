import { useObservable, useObservableState } from 'observable-hooks';
import { useCallback, useState } from 'react';
import { switchMap } from 'rxjs/operators';

import { P9ColorPredicateExpression, P9Predicate, P9StringOperator } from '../model/predicate';
import { makeMagicCardFilterStore } from './magic-card-filter.store';

const magicCardFilterService = makeMagicCardFilterStore();

export function useMagicCardFilterQuery() {
  const [_, query] = magicCardFilterService;
  return query;
}

export function useMagicCardColorPredicateBuilder(): [
  predicate: P9Predicate<P9ColorPredicateExpression> | undefined,
  update: (draft: Partial<P9ColorPredicateExpression>) => void,
] {
  const [[store, query]] = useState(() => magicCardFilterService);

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
  const [[store, query]] = useState(() => magicCardFilterService);

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
  const [[store, query]] = useState(() => magicCardFilterService);

  return [
    useObservableState(useObservable((id$) => id$.pipe(switchMap(([id_]) => query.selectEntity(id_))), [id])),
    useCallback((draft: Partial<P9Predicate>) => store.update(id, draft), [id, store]),
    useCallback(() => store.remove(id), [id, store]),
  ];
}

export function useMagicCardFilterPredicate(): [predicate: string | undefined, reset: () => void] {
  const [[store, query]] = useState(() => magicCardFilterService);

  const [predicate] = useObservableState(() => query.predicate$, undefined);
  const reset = useCallback(() => store.remove(), [store]);

  return [predicate, reset];
}
