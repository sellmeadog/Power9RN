import { map } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { Query } from '@datorama/akita';

import { P9AuthorizationState, P9AuthorizationStore } from './authorization.store';

@singleton()
export class P9AuthorizationQuery extends Query<P9AuthorizationState> {
  authorization$ = this.select(({ authorization }) => authorization);
  user$ = this.select(({ user }) => user);
  isAnonymous$ = this.authorization$.pipe(map((auth) => !auth));

  constructor(store: P9AuthorizationStore) {
    super(store);
  }
}
