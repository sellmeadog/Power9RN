import { map } from 'rxjs/operators';

import { Query } from '@datorama/akita';

import { whenDefined } from '../../../core/operators';
import { P9AuthorizationState, P9AuthorizationStore } from './authorization.store';

export class P9AuthorizationQuery extends Query<P9AuthorizationState> {
  currentUser$ = this.select(({ currentUser }) => currentUser).pipe(whenDefined());

  isAnonymous$ = this.select(({ currentUser }) => currentUser).pipe(
    map((user) => (user ? user.identities.every(({ providerType }) => providerType === 'anon-user') : true)),
  );

  constructor(store: P9AuthorizationStore) {
    super(store);
  }
}
