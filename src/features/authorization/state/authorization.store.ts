import { User } from 'realm';
import { Observer } from 'rxjs';

import { Store } from '@datorama/akita';

import { P9AuthorizationQuery } from './authorization.query';

export type P9User = User | null | undefined;

export interface P9AuthorizationState {
  currentUser: P9User;
}

export class P9AuthorizationStore extends Store<P9AuthorizationState> implements Observer<P9User> {
  constructor() {
    super({}, { name: 'authorization' });
  }

  next(value: P9User) {
    this.update((state) => ({ ...state, currentUser: value }));
  }

  error(error: unknown) {
    this.setError(error);
    this.setLoading(false);
  }

  complete() {
    this.setLoading(false);
  }
}

export function makeAuthorizationStore(): [store: P9AuthorizationStore, query: P9AuthorizationQuery] {
  const store = new P9AuthorizationStore();
  const query = new P9AuthorizationQuery(store);

  return [store, query];
}
