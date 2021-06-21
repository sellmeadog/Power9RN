import { useCallback } from 'react';

import { useDependency } from '../../../../core/di';
import { P9Predicate } from '../../model/predicate';
import { P9MagicCardFilterService } from '../../state/magic-card-filter.service';

type UpdatePredicateFn<E = any> = (patch: Partial<P9Predicate<E>>) => void;
type RemovePredicateFn = () => void;

export function useStringPredicateEditorFacade({
  attribute,
  id,
}: P9Predicate<string>): [update: UpdatePredicateFn<string>, remove: RemovePredicateFn] {
  const service = useDependency(P9MagicCardFilterService);

  return [
    useCallback(
      (patch: Partial<P9Predicate<string>>) => {
        service.updatePredicate(attribute, id, patch);
      },
      [attribute, id, service],
    ),
    useCallback(() => service.removePredicate(attribute, id), [attribute, id, service]),
  ];
}
