import produce from 'immer';
import { singleton } from 'tsyringe';

import { EntityState, EntityStore } from '@datorama/akita';

import { P9PredicateAttributeGroup } from '../model/predicate';

export interface P9MagicCardFilterState extends EntityState<P9PredicateAttributeGroup, string> {}

@singleton()
export class P9MagicCardFilterStore extends EntityStore<P9MagicCardFilterState> {
  constructor() {
    super({}, { name: 'magic-card-filter', producerFn: produce, idKey: 'attribute' });
    this.reset();
  }

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
      { attribute: 'card_faces.loyalty_numeric', predicates: [] },
      { attribute: 'card_faces.names', predicates: [] },
      { attribute: 'card_faces.oracle_text', predicates: [] },
      { attribute: 'card_faces.power_numeric', predicates: [] },
      { attribute: 'card_faces.toughness_numeric', predicates: [] },
      { attribute: 'card_faces.types', predicates: [] },
      { attribute: 'cmc', predicates: [] },
      { attribute: 'gameplay.stats', predicates: [] },
      { attribute: 'legalities', predicates: [] },
      { attribute: 'rarity', predicates: [] },
    ]);
}
