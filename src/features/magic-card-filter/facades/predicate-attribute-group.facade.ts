import { useObservable, useObservableState } from 'observable-hooks';
import { useCallback, useMemo } from 'react';
import { combineLatest, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

import { HashMap, ID } from '@datorama/akita';

import { useDependency } from '../../../core/di';
import {
  P9ComparisonOperator,
  P9LogicalOperator,
  P9Predicate,
  P9PredicateAttributeGroup,
  P9StringOperator,
} from '../model/predicate';
import { P9MagicCardFilterService } from '../state/magic-card-filter.service';

export type P9PredicateAttributeGroupState<E extends number | string> = {
  canReset: boolean;
  predicates: P9Predicate<E>[];
  selection: HashMap<boolean>;
};

export function usePredicateAttributeGroupState<E extends number | string>(
  attribute: string,
): P9PredicateAttributeGroupState<E> {
  const service = useDependency(P9MagicCardFilterService);
  const predicates$ = useObservable(() => service.selectAttributePredicates(attribute));
  const canReset$ = useObservable(() => predicates$.pipe(toBoolean()));
  const selection$ = useObservable(() => predicates$.pipe(toSelection()));

  return {
    canReset: useObservableState(canReset$, false),
    predicates: useObservableState(predicates$, []),
    selection: useObservableState(selection$, {}),
  };
}

export type P9PredicateAttributeGroupActions<E extends number | string> = {
  parseExpression: (expression: E) => void;
  reset: () => void;
  togglePredicate: (predicate: P9Predicate<E>) => void;
  update: (patch: Partial<P9PredicateAttributeGroup<E>>) => void;
};

export type P9PredicateActions<E extends number | string> = {
  removePredicate: (id: ID) => void;
  updatePredicate: (id: ID, patch: Partial<P9Predicate<E>>) => void;
};

export function usePredicateAttributeGroupFacade<E extends number | string>(
  attribute: string,
  options: {
    comparisonOperator?: P9ComparisonOperator;
    logicalOperator?: P9LogicalOperator;
    stringOperator?: P9StringOperator;
  } = { logicalOperator: P9LogicalOperator.And },
): [
  state: P9PredicateAttributeGroupState<E>,
  groupActions: P9PredicateAttributeGroupActions<E>,
  predicateActions: P9PredicateActions<E>,
] {
  const { comparisonOperator, logicalOperator, stringOperator } = options;
  const service = useDependency(P9MagicCardFilterService);

  const predicates$ = useObservable(() => service.selectAttributePredicates(attribute));
  const canReset$ = useObservable(() => predicates$.pipe(toBoolean()));
  const selection$ = useObservable(() => predicates$.pipe(toSelection()));
  const state$ = useObservable(() =>
    combineLatest({ canReset: canReset$, predicates: predicates$, selection: selection$ }),
  );

  const togglePredicate = useCallback(
    (predicate: P9Predicate<E>) => {
      service.togglePredicate(attribute, predicate);
    },
    [attribute, service],
  );

  const updatePredicate = useCallback(
    (id: ID, patch: Partial<P9Predicate<E>>) => {
      service.updatePredicate(attribute, id, patch);
    },
    [attribute, service],
  );

  const removePredicate = useCallback(
    (id: ID) => {
      service.removePredicate(attribute, id);
    },
    [attribute, service],
  );

  const parseExpression = useCallback(
    (expression: E) => {
      service.parseExpression(attribute, expression);
    },
    [attribute, service],
  );

  const update = useCallback(
    (patch: Partial<P9PredicateAttributeGroupState<E>>) => {
      service.updateAttributeGroup(attribute, patch);
    },
    [attribute, service],
  );

  const reset = useCallback(() => {
    service.resetAttribute(attribute);
  }, [attribute, service]);

  return [
    useObservableState(state$, { canReset: false, predicates: [], selection: {} }),
    useMemo(
      () => ({
        parseExpression,
        reset,
        togglePredicate,
        update,
      }),
      [parseExpression, reset, togglePredicate, update],
    ),
    useMemo(() => ({ removePredicate, updatePredicate }), [removePredicate, updatePredicate]),
  ];
}

function toBoolean(): OperatorFunction<P9Predicate<any>[], boolean> {
  return map(({ length }) => Boolean(length));
}

function toSelection<E extends number | string>(): OperatorFunction<P9Predicate<E>[], HashMap<boolean>> {
  return map((predicates) =>
    Object.entries(predicates).reduce(
      (selection, [_, { expression }]) => ({ ...selection, [expression]: true }),
      {} as HashMap<boolean>,
    ),
  );
}
