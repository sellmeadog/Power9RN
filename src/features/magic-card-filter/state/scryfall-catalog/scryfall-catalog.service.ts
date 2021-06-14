import { useObservableState } from 'observable-hooks';
import { useCallback, useState } from 'react';
import { defer, forkJoin, Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { useDependency } from '../../../../core/di';
import { ScryfallCatalog } from '../../../../core/scryfall/model';
import { P9ScryfallCatalog, P9ScryfallCatalogType } from './model';
import { P9ScryfallCatalogQuery } from './scryfall-catalog.query';
import { P9ScryfallCatalogStore } from './scryfall-catalog.store';

const catalogs: P9ScryfallCatalogType[] = [
  'artifact-types',
  'artist-names',
  'creature-types',
  'enchantment-types',
  'land-types',
  'planeswalker-types',
  'spell-types',
];

const makeCatalogRequest = async (catalog: P9ScryfallCatalogType): Promise<ScryfallCatalog> =>
  await (await fetch(`https://api.scryfall.com/catalog/${catalog}`)).json();

const title = (catalog: P9ScryfallCatalogType): string => {
  switch (catalog) {
    case 'artifact-types':
      return 'Artifact Types';

    case 'artist-names':
      return 'Artist Names';

    case 'creature-types':
      return 'Creature Types';

    case 'enchantment-types':
      return 'Enchantment Types';

    case 'land-types':
      return 'Land Types';

    case 'planeswalker-types':
      return 'Planeswalker Types';

    case 'spell-types':
      return 'Spell Types';

    default:
      return '';
  }
};

const catalogRequests$: Observable<P9ScryfallCatalog[]> = forkJoin(
  catalogs.map((catalog) =>
    defer(() => makeCatalogRequest(catalog)).pipe(
      retry(3),
      map(({ data }) => ({ id: catalog, data, title: title(catalog) })),
    ),
  ),
);

@singleton()
export class P9ScryfallCatalogService {
  constructor(private store: P9ScryfallCatalogStore) {}

  initialize = () => {
    catalogRequests$.subscribe(this.store);
  };

  filterArtists = (expression?: string) => this.store.update({ artist: expression });
}

export function useScryfallCatalogService(): [query: P9ScryfallCatalogQuery, service: P9ScryfallCatalogService] {
  const [tuple] = useState<[query: P9ScryfallCatalogQuery, service: P9ScryfallCatalogService]>([
    useDependency(P9ScryfallCatalogQuery),
    useDependency(P9ScryfallCatalogService),
  ]);

  return tuple;
}

export function useArtistCatalog(): [
  artists: P9ScryfallCatalog[] | undefined,
  expression: string | undefined,
  handleExpressionChange: (expression?: string) => void,
] {
  const [{ visibleArtists$, artistExpression$ }, service] = useScryfallCatalogService();
  const handleExpressionChange = useCallback((expression?: string) => service.filterArtists(expression), [service]);

  return [useObservableState(visibleArtists$), useObservableState(artistExpression$), handleExpressionChange];
}
