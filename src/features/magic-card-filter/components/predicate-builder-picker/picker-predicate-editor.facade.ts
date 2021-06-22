import { useObservable, useObservableState } from 'observable-hooks';
import { useCallback } from 'react';

import { HashMap } from '@datorama/akita';

import { useDependency } from '../../../../core/di';
import { P9Predicate } from '../../model/predicate';
import { P9MagicCardFilterService } from '../../state/magic-card-filter.service';

export function usePickerPredicateEditorFacade<E extends string | number = any>(
  attribute: string,
): [selection: HashMap<boolean>, toggle: (value: E) => void] {
  const service = useDependency(P9MagicCardFilterService);

  return [
    useObservableState(
      useObservable(() => service.selectAttributeSelection(attribute)),
      {},
    ),
    useCallback(
      (value: E) =>
        service.togglePredicate(attribute, { attribute, id: value.toString(), expression: value } as P9Predicate<E>),
      [attribute, service],
    ),
  ];
}
