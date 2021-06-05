import { Results } from 'realm';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { Query } from '@datorama/akita';

import { P9MagicCard } from '../../../core/public';
import { P9PublicPartitionQuery } from '../../../core/public/state/public-partition.query';
import { P9MagicCardFilterQuery } from '../../magic-card-filter';
import { P9MagicCardGalleryState, P9MagicCardGalleryStore } from './magic-card.store';

export class P9MagicCardGalleryQuery extends Query<P9MagicCardGalleryState> {
  #keywordPredicate$ = this.select(selectKeywordPredicate());

  keywordExpression$ = this.select(({ keywordExpression: keyword }) => keyword);
  visibleResults$ = combineLatest([
    this.partitionQuery.magicCards$,
    this.filterQuery.predicate$,
    this.#keywordPredicate$,
  ]).pipe(
    map(([results, filterPredicate, keywordPredicate]): [Results<P9MagicCard> | undefined, string] => [
      results,
      [filterPredicate, keywordPredicate]
        .join(' AND ')
        .trim()
        .replace(/^(AND)/, '')
        .replace(/(\sAND)$/, ''),
    ]),
    map(([results, predicate]) => (predicate ? results?.filtered(predicate) : results)),
  );

  constructor(
    store: P9MagicCardGalleryStore,
    private partitionQuery: P9PublicPartitionQuery,
    private filterQuery: P9MagicCardFilterQuery,
  ) {
    super(store);
  }
}

function selectKeywordPredicate(): (store: P9MagicCardGalleryState) => string | undefined {
  return ({ keywordExpression }) =>
    keywordExpression
      ?.trim()
      .split(' ')
      .filter(Boolean)
      .map((expression) => `card_faces.names BEGINSWITH[c] "${expression.trim()}"`)
      .join(' AND ');
}
