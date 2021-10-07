import { useObservable, useObservableState } from 'observable-hooks';
import { useCallback } from 'react';
import { Results } from 'realm';
import { combineLatest } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Lifecycle, scoped } from 'tsyringe';

import { Query } from '@datorama/akita';

import { useDependency } from '../../../core/di';
import { P9MagicCard, P9MagicCardObject } from '../../../core/public';
import { P9PublicPartitionQuery } from '../../../core/public/state/public-partition.query';
import { ResultsDataProvider } from '../../../core/realm/results-data-provider';
import { P9MagicCardFilterQuery } from '../../magic-card-filter';
import { P9MagicCardGalleryState, P9MagicCardGalleryStore } from './magic-card.store';

const dataProvider = new ResultsDataProvider<P9MagicCardObject>([]);

@scoped(Lifecycle.ContainerScoped)
export class P9MagicCardGalleryQuery extends Query<P9MagicCardGalleryState> {
  #keywordPredicate$ = this.select(selectKeywordPredicate());

  keywordExpression$ = this.select(({ keywordExpression: keyword }) => keyword);
  visibleResults$ = combineLatest([
    this.partitionQuery.magicCards$,
    this.filterQuery.predicate$.pipe(debounceTime(250)),
    this.#keywordPredicate$.pipe(debounceTime(50)),
  ]).pipe(
    map(([results, filterPredicate, keywordPredicate]): [Results<P9MagicCard & Realm.Object> | undefined, string] => [
      results,
      [filterPredicate, keywordPredicate] //, 'default_card == true']
        .filter(Boolean)
        .join(' AND ')
        .trim()
        .replace(/^(AND)/, '')
        .replace(/(\sAND)$/, ''),
    ]),
    map(([results, predicate]) =>
      predicate
        ? results?.filtered(`${predicate} SORT(name ASC, default_card DESC) DISTINCT(oracle_id)`)
        : results?.filtered('oracle_id == oracle_id SORT(name ASC, default_card DESC) DISTINCT(oracle_id)'),
    ),
  );

  dataProvider$ = this.visibleResults$.pipe(
    map((data) => dataProvider.cloneWithRows(data as unknown as P9MagicCardObject[])),
  );

  constructor(
    store: P9MagicCardGalleryStore,
    private partitionQuery: P9PublicPartitionQuery,
    private filterQuery: P9MagicCardFilterQuery,
  ) {
    super(store);
  }

  findMagicCard = (id: string) => {
    return this.partitionQuery.findMagicCard(id);
  };
}

function selectKeywordPredicate(): (store: P9MagicCardGalleryState) => string | undefined {
  return ({ keywordExpression }) =>
    keywordExpression
      ?.trim()
      .split(' ')
      .filter(Boolean)
      .map(
        (expression) =>
          `(card_faces.name ==[c] "${cleanExpression(expression)}" OR card_faces.names BEGINSWITH[c] "${cleanExpression(
            expression,
          )}")`,
      )
      .join(' AND ');
}

const cleanExpression = (value?: string): string[] => {
  return (
    value
      ?.trim()
      .replace(/[^\w\s+-]/gi, '')
      .split(' ')
      .filter(Boolean) ?? []
  );
};

export interface P9MagicCardGalleryFacade {
  dataProvider: ResultsDataProvider<P9MagicCardObject>;
  keywordExpression?: string;
  visibleResults?: Results<P9MagicCardObject>;
}

export function useMagicCardGalleryFacade(): [
  state: P9MagicCardGalleryFacade,
  setKeywordExpression: (expression: string) => void,
] {
  const store = useDependency(P9MagicCardGalleryStore);
  const query = useDependency(P9MagicCardGalleryQuery);

  const setKeywordExpression = useCallback(
    (expression: string) => store.update((state) => ({ ...state, keywordExpression: expression })),
    [store],
  );

  return [
    useObservableState(
      useObservable(() =>
        combineLatest({
          dataProvider: query.dataProvider$,
          keywordExpression: query.keywordExpression$,
          visibleResults: query.visibleResults$,
        }),
      ),
      { dataProvider } as P9MagicCardGalleryFacade,
    ),
    setKeywordExpression,
  ];
}
