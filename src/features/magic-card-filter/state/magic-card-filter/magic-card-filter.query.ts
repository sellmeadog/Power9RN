import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lifecycle, scoped } from 'tsyringe';

import { QueryEntity } from '@datorama/akita';

import { whenDefined } from '../../../../core/operators';
import { serialize } from '../../model';
import { P9MagicCardFilterState, P9MagicCardFilterStore } from './magic-card-filter.store';

const MAGIC_CARD_FILTER_ATTRIBUTES = [
  'card_faces.artist',
  'card_faces.colors',
  'card_faces.flavor_text',
  'card_faces.loyalty_numeric',
  'card_faces.names',
  'card_faces.oracle_text',
  'card_faces.power_numeric',
  'card_faces.toughness_numeric',
  'card_faces.types',
  'cmc',
  'legalities',
  'rarity',
];

@scoped(Lifecycle.ContainerScoped)
export class P9MagicCardFilterQuery extends QueryEntity<P9MagicCardFilterState> {
  canReset$: Observable<boolean> = this.selectAll({ filterBy: ({ predicates }) => Boolean(predicates.length) }).pipe(
    map(({ length }) => Boolean(length)),
  );

  predicate$: Observable<string> = combineLatest(
    MAGIC_CARD_FILTER_ATTRIBUTES.map((attribute) =>
      this.selectEntity(attribute).pipe(
        whenDefined(),
        map((group) => serialize(group)),
      ),
    ),
  ).pipe(
    map((predicates) =>
      predicates
        .filter(Boolean)
        .map((predicate) => `(${predicate.replace(/^(AND\s?|OR)\s+/, '')})`)
        .join(' AND '),
    ),
  );

  constructor(store: P9MagicCardFilterStore) {
    super(store);
  }
}
