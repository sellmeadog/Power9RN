import { combineLatest, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { QueryEntity } from '@datorama/akita';

import { whenDefined } from '../../../../core/operators';
import { P9ScryfallCatalog } from './model';
import { P9ScryfallCatalogState, P9ScryfallCatalogStore } from './scryfall-catalog.store';

@singleton()
export class P9ScryfallCatalogQuery extends QueryEntity<P9ScryfallCatalogState> {
  artists$: Observable<P9ScryfallCatalog[]> = this.selectEntity('artist-names').pipe(map(groupArtistNames));
  artistExpression$ = this.select((state) => state.artist);

  visibleArtists$: Observable<P9ScryfallCatalog[]> = combineLatest([
    this.artists$.pipe(whenDefined()),
    this.artistExpression$.pipe(
      debounceTime(50),
      map((expression) => expression?.trim()),
      distinctUntilChanged(),
    ),
  ]).pipe(map(filterArtists));

  types$ = this.selectAll({
    filterBy: ({ id }) => id.includes('_types'),
  });

  constructor(store: P9ScryfallCatalogStore) {
    super(store);
  }
}

function filterArtists([catalogs, filter = '']: [catalogs: P9ScryfallCatalog[], filter?: string]): P9ScryfallCatalog[] {
  return catalogs
    .map(({ title, id, data }) => ({
      id,
      title,
      data: data.filter((item) => item.toLowerCase().includes(filter.toLowerCase())),
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
