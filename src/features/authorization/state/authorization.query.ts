import { map } from 'rxjs/operators';

import { Query } from '@datorama/akita';

import { P9AuthorizationState, P9AuthorizationStore } from './authorization.store';

export class P9AuthorizationQuery extends Query<P9AuthorizationState> {
  currentUser$ = this.select(({ currentUser }) => currentUser);
  isAnonymous$ = this.select(({ currentUser }) => currentUser).pipe(map((user) => user?.providerType === 'anon-user'));

  constructor(store: P9AuthorizationStore) {
    super(store);
  }
}
