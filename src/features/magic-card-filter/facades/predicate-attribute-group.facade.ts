import { useObservable, useObservableState } from 'observable-hooks';
import { useCallback, useMemo } from 'react';
import { combineLatest, OperatorFunction } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { HashMap, ID } from '@datorama/akita';

import { useDependency } from '../../../core/di';
import {
  P9Predicate,
  P9PredicateAttributeGroup,
  P9PredicateAttributeGroupState,
  P9PredicateExpression,
  P9PredicateOptions,
} from '../model/predicate';
import { P9MagicCardFilterService } from '../state/magic-card-filter.service';

export type P9PredicateAttributeGroupActions<E extends P9PredicateExpression, S> = {
  parseExpression: (expression: E, options: P9PredicateOptions) => void;
  reset: () => void;
  togglePredicate: (predicate: P9Predicate<E>) => void;
  update: (patch: Partial<P9PredicateAttributeGroup<E, S>>) => void;
};

export type P9PredicateActions<E extends P9PredicateExpression> = {
  removePredicate: (id: ID) => void;
  updatePredicate: (id: ID, patch: Partial<P9Predicate<E>>) => void;
};

export type P9PredicateAttributeGroupTuple<E extends P9PredicateExpression, S> = [
  state: P9PredicateAttributeGroupState<E, S>,
  groupActions: P9PredicateAttributeGroupActions<E, S>,
  predicateActions: P9PredicateActions<E>,
];

export function usePredicateAttributeGroupFacade<E extends P9PredicateExpression = any, S = any>(
  attribute: string,
): P9PredicateAttributeGroupTuple<E, S> {
  const service = useDependency(P9MagicCardFilterService);

  const group$ = useObservable((attribute$) => attribute$.pipe(selectPredicateGroup(service)), [attribute]);
  const predicates$ = useObservable(() => group$.pipe(map(({ predicates }) => predicates as P9Predicate<E>[])));
  const canReset$ = useObservable(() => predicates$.pipe(toBoolean()));
  const selection$ = useObservable(() => predicates$.pipe(toSelection()));
  const state$ = useObservable(() =>
    combineLatest([canReset$, group$, selection$]).pipe(
      map(([canReset, entity, selection]) => ({ canReset, ...entity, selection })),
    ),
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
    (expression: E, options: P9PredicateOptions) => {
      service.parseExpression(attribute, expression, options);
    },
    [attribute, service],
  );

  const update = useCallback(
    (patch: Partial<P9PredicateAttributeGroupState<E, S>>) => {
      service.updateAttributeGroup(attribute, patch);
    },
    [attribute, service],
  );

  const reset = useCallback(() => {
    service.resetAttribute(attribute);
  }, [attribute, service]);

  return [
    useObservableState(state$, { attribute: '', canReset: false, predicates: [], selection: {} }),
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

function selectPredicateGroup(
  service: P9MagicCardFilterService,
): OperatorFunction<[string], P9PredicateAttributeGroup<any, any>> {
  return switchMap(([attribute]) => service.selectAttributeGroup(attribute));
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
