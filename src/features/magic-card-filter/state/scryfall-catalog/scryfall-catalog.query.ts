import { combineLatest, EMPTY, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { QueryEntity } from '@datorama/akita';

import { whenDefined } from '../../../../core/operators';
import { P9ScryfallCatalog } from './model';
import { P9ScryfallCatalogState, P9ScryfallCatalogStore } from './scryfall-catalog.store';

@singleton()
export class P9ScryfallCatalogQuery extends QueryEntity<P9ScryfallCatalogState> {
  expression$ = this.select((state) => state.expression).pipe(
    debounceTime(50),
    map((expression) => expression?.trim()),
    distinctUntilChanged(),
  );

  artists$: Observable<P9ScryfallCatalog[]> = this.selectEntity('artist-names').pipe(map(groupArtistNames));
  visibleArtists$: Observable<P9ScryfallCatalog[]> = combineLatest([
    this.artists$.pipe(whenDefined()),
    this.expression$,
  ]).pipe(map(filterCatalogs));

  gameFormats$ = this.selectAll({ filterBy: ({ id }) => id.includes('game-formats') }).pipe(whenDefined());

  types$ = this.selectAll({
    filterBy: ({ id }) => id.includes('-types'),
  });

  visibleTypes$ = combineLatest([this.types$.pipe(whenDefined()), this.expression$]).pipe(map(filterCatalogs));

  constructor(store: P9ScryfallCatalogStore) {
    super(store);
  }

  attributeCatalog = (attribute: string) => {
    switch (attribute) {
      case 'card_faces.artist':
        return this.visibleArtists$;

      case 'card_faces.types':
        return this.visibleTypes$;

      case 'legalities':
        return this.gameFormats$;

      default:
        return EMPTY;
    }
  };
}

function filterCatalogs([catalogs, expression = '']: [
  catalogs: P9ScryfallCatalog[],
  expression?: string,
]): P9ScryfallCatalog[] {
  return catalogs
    .map(({ title, id, data }) => ({
      id,
      title,
      data: data.filter((item) => item.toLowerCase().includes(expression.toLowerCase())),
    }))
    .filter(({ data }) => Boolean(data.length));
}

function groupArtistNames(catalog: P9ScryfallCatalog | undefined): P9ScryfallCatalog[] {
  const optionsMap = catalog?.data.reduce((hash, name) => {
    let key = name[0].toUpperCase();
    key = /[A-Z]/.test(key) ? key : 'Other';

    const set = hash.get(key);

    if (set) {
      set.push(name);
    } else {
      hash.set(key, [name]);
    }

    return hash;
  }, new Map<string, string[]>());

  return optionsMap
    ? Array.from(optionsMap.entries()).map(([key, names]) => ({ id: key, title: key, data: names }))
    : [];
}
