import { Observer } from 'rxjs';
import { singleton } from 'tsyringe';

import { EntityState, EntityStore } from '@datorama/akita';

import { P9ScryfallCatalog } from './model';
import { P9ScryfallCatalogQuery } from './scryfall-catalog.query';

export interface P9ScryfallCatalogState extends EntityState<P9ScryfallCatalog, string> {
  artist?: string;
}

@singleton()
export class P9ScryfallCatalogStore
  extends EntityStore<P9ScryfallCatalogState>
  implements Observer<P9ScryfallCatalog[]>
{
  constructor() {
    super({}, { name: 'scryfall-catalog' });
  }

  next(value: P9ScryfallCatalog[]) {
    this.set(value);
    this.setLoading(false);
  }

  error(error: any) {
    this.setError(error);
    this.setLoading(false);
  }

  complete() {
    this.setLoading(false);
  }
}

export function makeScryfallCatalogStore(): [store: P9ScryfallCatalogStore, query: P9ScryfallCatalogQuery] {
  const store = new P9ScryfallCatalogStore();
  const query = new P9ScryfallCatalogQuery(store);

  return [store, query];
}
