import { useObservable, useObservableState } from 'observable-hooks';
import { useCallback } from 'react';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { singleton } from 'tsyringe';
import { v1 } from 'uuid';

import { arrayAdd, arrayRemove, arrayToggle, arrayUpdate, ID } from '@datorama/akita';
import { useNavigation } from '@react-navigation/core';

import { useDependency } from '../../../core/di';
import { P9ColorPredicateExpression, P9LogicalOperator, P9Predicate, P9StringOperator } from '../model/predicate';
import { P9MagicCardFilterQuery } from './magic-card-filter.query';
import { P9MagicCardFilterStore } from './magic-card-filter.store';

@singleton()
export class P9MagicCardFilterService {
  constructor(private store: P9MagicCardFilterStore, private query: P9MagicCardFilterQuery) {}

  selectAttributePredicates = <E = any>(attribute: string): Observable<P9Predicate<E>[]> =>
    this.query.attributePredicates(attribute);

  selectAttributeSelection = (attribute: string) => this.query.attributeSelection(attribute);

  parseStringExpression = (
    attribute: string,
    expression: string,
    logicalOperator = P9LogicalOperator.And,
    stringOperator = P9StringOperator.BeginsWith,
  ) => {
    this.store.update(attribute, (draft) => {
      draft.predicates = arrayAdd(
        draft.predicates,
        expression
          .trim()
          .split(' ')
          .filter(Boolean)
          .map(makeStringPredicate(attribute, logicalOperator, stringOperator)),
      );
    });
  };

  removePredicate = (attribute: string, id: string) => {
    this.store.update(attribute, (draft) => {
      draft.predicates = arrayRemove(draft.predicates, id);
    });
  };

  resetAll = () => {
    this.store.reset();
  };

  resetAttribute = (attribute: string) => {
    this.store.resetAttribute(attribute);
  };

  togglePredicate = <E = any>(attribute: string, predicate: P9Predicate<E>) => {
    this.store.update(attribute, (draft) => {
      draft.predicates = arrayToggle(draft.predicates, predicate, ({ expression: a }, { expression: b }) => a === b);
    });
  };

  updatePredicate = <E extends ID = any>(attribute: string, id: E, patch: Partial<P9Predicate<E>>) => {
    this.store.update(attribute, (draft) => {
      draft.predicates = arrayUpdate(draft.predicates, id, patch);
    });
  };
}

export function useMagicCardFilterQuery() {
  return useDependency(P9MagicCardFilterQuery);
}

export function useMagicCardColorPredicateBuilder(): [
  expression: P9ColorPredicateExpression | undefined,
  update: (patch: Partial<P9ColorPredicateExpression>) => void,
] {
  const store = useDependency(P9MagicCardFilterStore);
  const query = useDependency(P9MagicCardFilterQuery);

  const [expression] = useObservableState(
    () => query.colorPredicate$,
    () => ({ fuzziness: 0, selection: {} }),
  );

  const update = useCallback(
    ({ selection, ...rest }: Partial<P9ColorPredicateExpression>) => {
      store.update('card_faces.colors', (draft) => {
        if (selection) {
          draft.predicates.selection = selection;
        }
        draft.predicates = { ...draft.predicates, ...rest };
      });
    },
    [store],
  );

  return [expression, update];
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
        (attribute$) => attribute$.pipe(switchMap(([attribute_]) => query.predicateArray(attribute_))),
        [attribute],
      ),
    ),
    useCallback(
      (expression: string, stringOperator: P9StringOperator) =>
        store.parseStringExpression(attribute, expression, stringOperator),
      [attribute, store],
    ),
    useCallback(() => store.resetAttribute(attribute), [attribute, store]),
  ];
}

export function useMagicCardStringPredicateEditor({
  attribute,
  id,
}: P9Predicate<string>): [update: (patch: Partial<P9Predicate>) => void, remove: () => void] {
  const store = useDependency(P9MagicCardFilterStore);

  return [
    useCallback(
      (patch: Partial<P9Predicate<string>>) => {
        store.update(attribute, (state) => {
          state.predicates = arrayUpdate(state.predicates as any, id, patch);
        });
      },
      [attribute, id, store],
    ),
    useCallback(
      () =>
        store.update(attribute, (state) => {
          state.predicates = arrayRemove(state.predicates as any, id);
        }),
      [attribute, id, store],
    ),
  ];
}

export function useMagicCardFilterFacade(): [
  state: { predicate: string | undefined; canReset: boolean },
  reset: () => void,
  navigate: () => void,
] {
  const { navigate } = useNavigation();
  const store = useDependency(P9MagicCardFilterStore);
  const query = useDependency(P9MagicCardFilterQuery);

  return [
    {
      predicate: useObservableState(query.predicate$, undefined),
      canReset: useObservableState(query.predicate$.pipe(map(Boolean)), false),
    },
    useCallback(() => store.reset(), [store]),
    useCallback(() => navigate('P9:MagicCardFilter'), [navigate]),
  ];
}

const makeStringPredicate =
  (attribute: string, logicalOperator: P9LogicalOperator, stringOperator: P9StringOperator) =>
  (expression: string): P9Predicate<string> => ({
    attribute,
    expression,
    id: v1(),
    logicalOperator,
    stringOperator,
  });
