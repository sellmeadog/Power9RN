import { Credentials } from 'realm';
import { defer, iif, of } from 'rxjs';
import { retry } from 'rxjs/operators';

import { makeRealmClientService, P9RealmClientService } from '../../../core/realm';
import { P9AuthorizationQuery } from './authorization.query';
import { makeAuthorizationStore, P9AuthorizationStore } from './authorization.store';

export interface AuthError {
  readonly code: number;
  readonly message: string;
}

export class P9AuthorizationService {
  constructor(private client: P9RealmClientService, private store: P9AuthorizationStore) {}

  authorize = (): void => {
    this.store.setLoading(true);

    iif(
      () => this.client.currentUser === null,
      defer(() => this.client.logIn(Credentials.anonymous())).pipe(retry(3)),
      of(this.client.currentUser),
    ).subscribe(this.store);
  };

  authenticate = (): void => {
    this.store.setError(null);
    this.store.setLoading(true);

    defer(() => this.client.logIn(Credentials.jwt('')))
      .pipe(retry(3))
      .subscribe(this.store);
  };
}

export function makeP9AuthorizationService(): [query: P9AuthorizationQuery, service: P9AuthorizationService] {
  const client = makeRealmClientService();
  const [store, query] = makeAuthorizationStore();

  return [query, new P9AuthorizationService(client, store)];
}
