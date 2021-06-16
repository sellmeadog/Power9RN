import { Observer } from 'rxjs';
import { singleton } from 'tsyringe';

import { EntityState, EntityStore } from '@datorama/akita';

import { P9ScryfallCatalog } from './model';
import { P9ScryfallCatalogQuery } from './scryfall-catalog.query';

export interface P9ScryfallCatalogState extends EntityState<P9ScryfallCatalog, string> {
  expression?: string;
}

@singleton()
export class P9ScryfallCatalogStore
  extends EntityStore<P9ScryfallCatalogState>
  implements Observer<P9ScryfallCatalog[]>
{
  constructor() {
    super({}, { name: 'scryfall-catalog' });
    this.set([
      {
        id: 'base-types',
        data: [
          'Artifact',
          'Conspiracy',
          'Creature',
          'Emblem',
          'Enchantment',
          'Hero',
          'Instant',
          'Land',
          'Phenomenon',
          'Plane',
          'Planeswalker',
          'Scheme',
          'Sorcery',
          'Tribal',
          'Vanguard',
        ],
        title: 'Types',
      },
      {
        id: 'super-types',
        data: ['Basic', 'Elite', 'Legendary', 'Ongoing', 'Snow', 'Token', 'World'],
        title: 'Supertypes',
      },
      {
        id: 'game-formats-constructed',
        data: ['Standard', 'Historic', 'Pioneer', 'Modern', 'Pauper', 'Legacy', 'Vintage'],
        title: '',
      },
      {
        id: 'game-formats-singleton',
        data: ['Brawl', 'Commander'],
        title: 'Singleton',
      },
    ]);
  }

  next(value: P9ScryfallCatalog[]) {
    this.add(value);
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
