import { filter, map } from 'rxjs/operators';
import { Lifecycle, scoped } from 'tsyringe';

import { Query } from '@datorama/akita';

import { P9AuthorizationState, P9AuthorizationStore, P9User } from './authorization.store';

@scoped(Lifecycle.ContainerScoped)
export class P9AuthorizationQuery extends Query<P9AuthorizationState> {
  authorization$ = this.select(({ authorization }) => authorization);
  user$ = this.select(({ user }) => user);
  authorizedUser$ = this.user$.pipe(
    filter((user): user is P9User =>
      Boolean(user?.identities.map((identity) => identity.providerType).includes('custom-token')),
    ),
  );
  isAnonymous$ = this.authorization$.pipe(map((auth) => !auth));

  constructor(store: P9AuthorizationStore) {
    super(store);
  }
}
