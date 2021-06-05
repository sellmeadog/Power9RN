import { useObservable, useObservableState } from 'observable-hooks';
import { useCallback, useState } from 'react';
import { switchMap } from 'rxjs/operators';

import { P9Predicate, P9StringOperator } from '../model/predicate';
import { makeMagicCardFilterStore } from './magic-card-filter.store';

const magicCardFilterService = makeMagicCardFilterStore();

export function useMagicCardFilterQuery() {
  const [_, query] = magicCardFilterService;
  return query;
}

export function useMagicCardStringPredicateBuilder(
  attribute: string,
): [
  predicates: P9Predicate[] | undefined,
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
