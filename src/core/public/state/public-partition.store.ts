import Realm, { Results } from 'realm';
import { Observer } from 'rxjs';

import { Store } from '@datorama/akita';

import { P9MagicCard } from '../schema/magic-card';
import { P9PublicPartitionQuery } from './public-partition.query';

export interface P9PublicPartitionState {
  partition?: Realm;
  magicCards?: Results<P9MagicCard>;
}

export class P9PublicPartitionStore
  extends Store<P9PublicPartitionState>
  implements Observer<Partial<P9PublicPartitionState>>
{
  constructor() {
    super({}, { name: 'public' });
  }

  next = (value: Partial<P9PublicPartitionState>): void => {
    this.update((state) => ({ ...state, ...value }));
  };

  error = (error: unknown): void => {
    this.setError(error);
  };

  complete = (): void => {
    this.setLoading(false);
  };
}

export function makePublicPartitionStore(): [store: P9PublicPartitionStore, query: P9PublicPartitionQuery] {
  const store = new P9PublicPartitionStore();
  const query = new P9PublicPartitionQuery(store);

  return [store, query];
}
