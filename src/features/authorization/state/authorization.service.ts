import { Credentials } from 'realm';
import { defer, iif, of } from 'rxjs';
import { exhaustMap, mapTo, mergeMap, retry, tap } from 'rxjs/operators';

import { makeAuthorizationClientService, P9AuthorizationClientService } from '../../../core/authorization';
import { makeRealmClientService, P9RealmClientService } from '../../../core/realm';
import { P9AuthorizationQuery } from './authorization.query';
import { makeAuthorizationStore, P9AuthorizationStore } from './authorization.store';

export interface AuthError {
  readonly code: number;
  readonly message: string;
}

export class P9AuthorizationService {
  constructor(
    private authClient: P9AuthorizationClientService,
    private realmClient: P9RealmClientService,
    private store: P9AuthorizationStore,
  ) {}

  authorize = (): void => {
    this.store.setLoading(true);

    iif(
      () => Boolean(this.realmClient.currentUser),
      of(this.realmClient.currentUser!).pipe(
        tap(async (user) =>
          console.debug(user.id, user.profile.name, user.identities, user.state, await user.refreshCustomData()),
        ),
        mergeMap((user) => defer(() => user.refreshCustomData()).pipe(retry(3), mapTo(user))),
      ),
      defer(() => this.realmClient.logIn(Credentials.anonymous())).pipe(retry(3)),
    ).subscribe(this.store);
  };

  authenticate = (credentials: Credentials.EmailPasswordPayload): void => {
    this.store.setError(null);
    this.store.setLoading(true);

    this.authClient
      .authenticate(credentials)
      .pipe(
        exhaustMap(({ idToken }) => {
          return defer(() => this.realmClient.logIn(Credentials.jwt(idToken))).pipe(retry(3));
        }),
      )
      .subscribe(this.store);
  };

  register = (credentials: Credentials.EmailPasswordPayload): void => {
    this.store.setError(null);
    this.store.setLoading(true);

    this.authClient
      .authenticate(credentials)
      .pipe(
        exhaustMap(({ idToken }) => {
          return of(this.realmClient.currentUser!).pipe(
            mergeMap((user) =>
              defer(() => user.linkCredentials(Credentials.jwt(idToken))).pipe(
                retry(3),
                tap((user_) => console.debug(JSON.stringify(user_, undefined, 2))),
                mapTo(user),
              ),
            ),
          );
        }),
      )
      .subscribe(this.store);
  };
}

export function makeP9AuthorizationService(): [query: P9AuthorizationQuery, service: P9AuthorizationService] {
  const authClient = makeAuthorizationClientService();
  const realmClient = makeRealmClientService();
  const [store, query] = makeAuthorizationStore();

  return [query, new P9AuthorizationService(authClient, realmClient, store)];
}
