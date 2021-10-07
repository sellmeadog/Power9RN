import { useObservableState } from 'observable-hooks';
import { useCallback, useState } from 'react';
import { defer, forkJoin, Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { Lifecycle, scoped } from 'tsyringe';

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

@scoped(Lifecycle.ContainerScoped)
export class P9ScryfallCatalogService {
  constructor(private store: P9ScryfallCatalogStore) {}

  initialize = () => {
    catalogRequests$.subscribe(this.store);
  };

  setExpression = (expression?: string) => this.store.update({ expression });
}

export function useScryfallCatalogService(): [query: P9ScryfallCatalogQuery, service: P9ScryfallCatalogService] {
  const [tuple] = useState<[query: P9ScryfallCatalogQuery, service: P9ScryfallCatalogService]>([
    useDependency(P9ScryfallCatalogQuery),
    useDependency(P9ScryfallCatalogService),
  ]);

  return tuple;
}

export function useCatalogFacade(
  attribute: string,
): [catalogs: P9ScryfallCatalog[], expression: string | undefined, setExpression: (expression?: string) => void] {
  const [query, service] = useScryfallCatalogService();

  return [
    useObservableState(query.attributeCatalog(attribute), []),
    useObservableState(query.expression$, ''),
    useCallback((expression?: string) => service.setExpression(expression), [service]),
  ];
}
