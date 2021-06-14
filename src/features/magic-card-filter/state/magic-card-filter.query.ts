import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { QueryEntity } from '@datorama/akita';

import { P9ColorPredicateExpression, P9PickerPredicateExpression, P9Predicate } from '../model/predicate';
import { serialize } from '../model/serialization';
import { P9MagicCardFilterState, P9MagicCardFilterStore } from './magic-card-filter.store';

@singleton()
export class P9MagicCardFilterQuery extends QueryEntity<P9MagicCardFilterState> {
  colorPredicate$: Observable<P9Predicate<P9ColorPredicateExpression> | undefined> =
    this.selectEntity('card_faces.colors');

  predicate$ = this.selectAll().pipe(
    map((predicates) =>
      predicates
        .filter(({ expression }) => Boolean(expression))
        .map(serialize)
        .join(' '),
    ),
    map((predicate) => predicate.replace(/^(AND\s?|OR)\s+/, '')),
  );

  constructor(store: P9MagicCardFilterStore) {
    super(store);
  }

  forAttribute = (attribute: string): Observable<P9Predicate[] | undefined> =>
    this.selectAll({
      filterBy: ({ attribute: attirbute_ }) => attirbute_ === attribute,
    });

  pickerExpression = (
    attribute: 'card_faces.artist' | 'card_faces.types',
  ): Observable<P9Predicate<P9PickerPredicateExpression> | undefined> => this.selectEntity(attribute);
}
