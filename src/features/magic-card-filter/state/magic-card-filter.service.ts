import { useObservable, useObservableState } from 'observable-hooks';
import { useCallback, useState } from 'react';
import { switchMap } from 'rxjs/operators';

import { makeMagicCardFilterStore, P9Predicate } from './magic-card-filter.store';

const magicCardFilterService = makeMagicCardFilterStore();

export function useMagicCardStringPredicateBuilder(
  attribute: string,
): [predicates: P9Predicate[] | undefined, parser: (expression: string) => void, reset: () => void] {
  const [[store, query]] = useState(() => magicCardFilterService);

  return [
    useObservableState(
      useObservable(
        (attribute$) => attribute$.pipe(switchMap(([attribute_]) => query.forAttribute(attribute_))),
        [attribute],
      ),
    ),
    useCallback((expression: string) => store.parseStringExpression(attribute, expression), [attribute, store]),
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
