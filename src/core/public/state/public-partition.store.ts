import Realm, { Results } from 'realm';
import { Observer } from 'rxjs';
import { Lifecycle, scoped } from 'tsyringe';

import { Store } from '@datorama/akita';

import { P9MagicCardObject } from '../schema/magic-card';

export interface P9PublicPartitionState {
  partition?: Realm;
  magicCards?: Results<P9MagicCardObject>;
}

@scoped(Lifecycle.ContainerScoped)
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
