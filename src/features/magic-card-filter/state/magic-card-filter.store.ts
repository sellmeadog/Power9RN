import produce from 'immer';
import { v1 } from 'uuid';

import { EntityState, EntityStore } from '@datorama/akita';

import { P9LogicalOperator, P9Predicate, P9StringOperator } from '../model/predicate';
import { P9MagicCardFilterQuery } from './magic-card-filter.query';

export interface P9MagicCardFilterState extends EntityState<P9Predicate> {}

export class P9MagicCardFilterStore extends EntityStore<P9MagicCardFilterState> {
  constructor() {
    super({}, { name: 'magic-card-filter', producerFn: produce });
  }

  parseStringExpression = (attribute: string, expression: string, stringOperator: P9StringOperator) => {
    const predicates: P9Predicate[] = expression
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((expression_) => ({
        attribute,
        expression: expression_,
        id: v1(),
        logicalOperator: P9LogicalOperator.And,
        stringOperator,
      }));

    this.upsertMany(predicates);
  };

  removePerAttribute = (attribute: string) => {
    this.remove((entity: Readonly<P9Predicate>) => entity.attribute === attribute);
  };
}

export type P9MagicCardFilterTuple = [store: P9MagicCardFilterStore, query: P9MagicCardFilterQuery];

export function makeMagicCardFilterStore(): P9MagicCardFilterTuple {
  const store = new P9MagicCardFilterStore();
  const query = new P9MagicCardFilterQuery(store);

  return [store, query];
}
