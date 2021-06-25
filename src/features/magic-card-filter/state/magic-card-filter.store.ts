import produce from 'immer';
import { singleton } from 'tsyringe';
import { v1 } from 'uuid';

import { arrayAdd, EntityState, EntityStore, isArray } from '@datorama/akita';

import { P9LogicalOperator, P9Predicate, P9PredicateAttributeGroup, P9StringOperator } from '../model/predicate';

export interface P9MagicCardFilterState extends EntityState<P9PredicateAttributeGroup, string> {}

@singleton()
export class P9MagicCardFilterStore extends EntityStore<P9MagicCardFilterState> {
  constructor() {
    super({}, { name: 'magic-card-filter', producerFn: produce, idKey: 'attribute' });
    this.reset();
  }

  parseStringExpression = (attribute: string, expression: string, stringOperator: P9StringOperator) => {
    const predicates: P9Predicate<string>[] = expression
      .trim()
      .split(' ')
      .filter(Boolean)
      .map(makeStringPredicate(attribute, stringOperator));

    this.update(attribute, (state: P9PredicateAttributeGroup<string>) => {
      if (isArray(state.predicates)) {
        state.predicates = arrayAdd(state.predicates, predicates);
      } else {
        throw new Error(`parseStringExpression called for ${attribute} whose predicate state is not an array.`);
      }
    });
  };

  resetAttribute = (attribute: string) => {
    this.update(attribute, (draft) => {
      draft.predicates = [];
    });
  };

  reset = () =>
    this.set([
      { attribute: 'card_faces.artist', predicates: [] },
      { attribute: 'card_faces.colors', predicates: [] },
      { attribute: 'card_faces.flavor_text', predicates: [] },
      { attribute: 'card_faces.loyalty', predicates: [] },
      { attribute: 'card_faces.names', predicates: [] },
      { attribute: 'card_faces.oracle_text', predicates: [] },
      { attribute: 'card_faces.power', predicates: [] },
      { attribute: 'card_faces.toughness', predicates: [] },
      { attribute: 'card_faces.types', predicates: [] },
      { attribute: 'cmc', predicates: [] },
      { attribute: 'gameplay.stats', predicates: [] },
      { attribute: 'legalities', predicates: [] },
      { attribute: 'rarity', predicates: [] },
    ]);
}

const makeStringPredicate =
  (attribute: string, stringOperator: P9StringOperator) =>
  (expression: string): P9Predicate<string> => ({
    attribute,
    expression,
    id: v1(),
    logicalOperator: P9LogicalOperator.And,
    stringOperator,
  });
