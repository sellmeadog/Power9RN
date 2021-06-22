import { useObservable, useObservableState } from 'observable-hooks';
import { useCallback } from 'react';
import { map } from 'rxjs/operators';

import { HashMap } from '@datorama/akita';

import { useDependency } from '../../../../core/di';
import { P9Predicate } from '../../model/predicate';
import { P9MagicCardFilterService } from '../../state/magic-card-filter.service';

export function usePickerPredicateTableFacade<E extends string | number = any>(
  attribute: string,
): [
  state: { canReset: boolean; selection: HashMap<boolean> },
  toggle: (predicate: P9Predicate<E>) => void,
  reset: () => void,
] {
  const service = useDependency(P9MagicCardFilterService);
  const selection$ = useObservable(() => service.selectAttributeSelection(attribute));

  return [
    {
      canReset: useObservableState(
        selection$.pipe(map((selection) => Boolean(Object.entries(selection).length))),
        false,
      ),
      selection: useObservableState(selection$, {}),
    },
    useCallback((predicate: P9Predicate<E>) => service.togglePredicate(attribute, predicate), [attribute, service]),
    useCallback(() => service.resetAttribute(attribute), [attribute, service]),
  ];
}
