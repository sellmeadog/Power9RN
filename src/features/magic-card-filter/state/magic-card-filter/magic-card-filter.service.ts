import { Observable } from 'rxjs';
import { singleton } from 'tsyringe';
import { v1 } from 'uuid';

import { arrayAdd, arrayRemove, arrayToggle, arrayUpdate, ID } from '@datorama/akita';

import { whenDefined } from '../../../../core/operators';
import {
  P9LogicalOperator,
  P9Predicate,
  P9PredicateAttributeGroup,
  P9PredicateExpression,
  P9PredicateOptions,
  P9StringOperator,
} from '../../model';
import { P9MagicCardFilterQuery } from './magic-card-filter.query';
import { P9MagicCardFilterStore } from './magic-card-filter.store';

@singleton()
export class P9MagicCardFilterService {
  constructor(private store: P9MagicCardFilterStore, private query: P9MagicCardFilterQuery) {}

  selectAttributeGroup = <E extends P9PredicateExpression = any, S = any>(
    attribute: string,
  ): Observable<P9PredicateAttributeGroup<E, S>> => this.query.selectEntity(attribute).pipe(whenDefined());

  parseExpression = <E extends P9PredicateExpression>(
    attribute: string,
    expression: E,
    options: P9PredicateOptions,
  ) => {
    const expressionType = typeof expression;

    switch (expressionType) {
      case 'string':
        this.parseStringExpression(attribute, expression as string, options);
        break;

      default:
        throw new Error(`Cannot parse an expression of type ${expressionType}`);
    }
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

  private parseStringExpression = (
    attribute: string,
    expression: string,
    { logicalOperator = P9LogicalOperator.And, stringOperator = P9StringOperator.BeginsWith }: P9PredicateOptions,
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
