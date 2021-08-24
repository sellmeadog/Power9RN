import { map } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { Query } from '@datorama/akita';

import { whenDefined } from '../operators';
import { P9AuthorizationState, P9AuthorizationStore } from './authorization.store';

@singleton()
export class P9AuthorizationQuery extends Query<P9AuthorizationState> {
  authorization$ = this.select(({ authorization }) => authorization).pipe(whenDefined());
  user$ = this.select(({ user }) => user);
  isAnonymous$ = this.user$.pipe(
    map((user) => user?.identities.every(({ providerType }) => providerType === 'anon-user') ?? true),
  );

  constructor(store: P9AuthorizationStore) {
    super(store);
  }
}
