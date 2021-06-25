import { useObservableState } from 'observable-hooks';
import { useCallback } from 'react';
import { Observable } from 'rxjs';
import { singleton } from 'tsyringe';
import { v1 } from 'uuid';

import { arrayAdd, arrayRemove, arrayToggle, arrayUpdate, ID } from '@datorama/akita';
import { useNavigation } from '@react-navigation/core';

import { useDependency } from '../../../core/di';
import { whenDefined } from '../../../core/operators';
import {
  P9LogicalOperator,
  P9Predicate,
  P9PredicateAttributeGroup,
  P9PredicateExpression,
  P9StringOperator,
} from '../model/predicate';
import { P9MagicCardFilterQuery } from './magic-card-filter.query';
import { P9MagicCardFilterStore } from './magic-card-filter.store';

@singleton()
export class P9MagicCardFilterService {
  constructor(private store: P9MagicCardFilterStore, private query: P9MagicCardFilterQuery) {}

  selectAttributeGroup = <E extends P9PredicateExpression = any, S = any>(
    attribute: string,
  ): Observable<P9PredicateAttributeGroup<E, S>> => this.query.selectEntity(attribute).pipe(whenDefined());

  parseExpression = <E extends P9PredicateExpression>(attribute: string, expression: E) => {
    const expressionType = typeof expression;

    switch (expressionType) {
      case 'string':
        this.parseStringExpression(attribute, expression as string);
        break;

      default:
        throw new Error(`Cannot parse an expression of type ${expressionType}`);
    }
  };

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

  removePredicate = (attribute: string, id: ID) => {
    this.store.update(attribute, (draft) => {
      draft.predicates = arrayRemove(draft.predicates, id);
    });
  };

  resetAttribute = (attribute: string) => {
    this.store.resetAttribute(attribute);
  };

  togglePredicate = <E extends P9PredicateExpression = any>(attribute: string, predicate: P9Predicate<E>) => {
    this.store.update(attribute, (draft) => {
      draft.predicates = arrayToggle(draft.predicates, predicate, ({ expression: a }, { expression: b }) => a === b);
    });
  };

  updatePredicate = <E extends P9PredicateExpression = any>(
    attribute: string,
    id: ID,
    patch: Partial<P9Predicate<E>>,
  ) => {
    this.store.update(attribute, (draft) => {
      draft.predicates = arrayUpdate(draft.predicates, id, patch);
    });
  };

  updateAttributeGroup = <E extends P9PredicateExpression = any, S = any>(
    attribute: string,
    patch: Partial<P9PredicateAttributeGroup<E, S>>,
  ) => {
    this.store.update(attribute, (draft) => {
      if (patch.metadata) {
        if (draft.metadata) {
          Object.entries(patch.metadata).forEach(([key, value]) => {
            draft.metadata[key] = value;
          });
        } else {
          draft.metadata = patch.metadata;
        }
      }
    });
  };
}

export function useMagicCardFilterQuery() {
  return useDependency(P9MagicCardFilterQuery);
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
  state: { predicate: string; canReset: boolean },
  reset: () => void,
  navigate: () => void,
] {
  const { navigate } = useNavigation();
  const store = useDependency(P9MagicCardFilterStore);
  const query = useDependency(P9MagicCardFilterQuery);

  return [
    {
      predicate: useObservableState(query.predicate$, ''),
      canReset: useObservableState(query.canReset$, false),
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
