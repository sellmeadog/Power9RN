import { useObservable, useObservableState } from 'observable-hooks';
import { useCallback } from 'react';
import { map } from 'rxjs/operators';

import { useDependency } from '../../../../core/di';
import { P9LogicalOperator, P9Predicate, P9StringOperator } from '../../model/predicate';
import { P9MagicCardFilterService } from '../../state/magic-card-filter.service';

export function useStringPredicateBuilderFacade(
  attribute: string,
  stringOperator = P9StringOperator.BeginsWith,
  logicalOperator = P9LogicalOperator.And,
): [
  state: { canReset: boolean; predicates: P9Predicate<string>[] },
  parseExpression: (expression: string) => void,
  reset: () => void,
] {
  const service = useDependency(P9MagicCardFilterService);
  const predicates$ = useObservable(() => service.selectAttributePredicates<string>(attribute));

  return [
    {
      canReset: useObservableState(predicates$.pipe(map(({ length }) => Boolean(length))), false),
      predicates: useObservableState(predicates$, []),
    },
    useCallback(
      (expression: string) => {
        service.parseStringExpression(attribute, expression, logicalOperator, stringOperator);
      },
      [attribute, logicalOperator, service, stringOperator],
    ),
    useCallback(() => {
      service.resetAttribute(attribute);
    }, [attribute, service]),
  ];
}
