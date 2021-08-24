import { useObservable, useObservableState } from 'observable-hooks';
import { useCallback, useLayoutEffect } from 'react';
import Environment from 'react-native-config';
import { App, Credentials, User } from 'realm';
import { combineLatest, defer, merge, of, timer } from 'rxjs';
import { first, map, mapTo, mergeMap, mergeMapTo, switchMap } from 'rxjs/operators';
import { injectable, registry } from 'tsyringe';

import { useDependency } from '../di';
import { P9Auth0Client, P9PasswordCredentials } from './auth0-client';
import { P9AuthorizationQuery } from './authorization.query';
import { P9AuthorizationStore } from './authorization.store';

@injectable()
@registry([{ token: App, useFactory: () => App.getApp(Environment.P9_MONGODB_REALM_APP_ID) }])
export class P9AuthorizationService {
  constructor(
    private store: P9AuthorizationStore,
    private query: P9AuthorizationQuery,
    private app: App,
    private auth0: P9Auth0Client,
  ) {}

  authenticate = (credentials: P9PasswordCredentials) => {
    this.auth0
      .authenticate(credentials)
      .pipe(map((authorization) => ({ authorization })))
      .subscribe(this.store);
  };

  authorize = () => {
    return merge(
      of(this.app.currentUser).pipe(
        mergeMap((user) => (user ? of(user) : defer(() => this.app.logIn(Credentials.anonymous())))),
      ),
      this.query.authorization$.pipe(
        switchMap(({ idToken }) =>
          defer(() => this.app.currentUser!.linkCredentials(Credentials.jwt(idToken))).pipe(
            mapTo(this.app.currentUser!),
          ),
        ),
      ),
    )
      .pipe(map((user) => ({ user })))
      .subscribe(this.store);
  };

  scheduleRefresh = () => {
    return this.query.authorization$
      .pipe(
        first(),
        switchMap(({ expiresIn, refreshToken }) =>
          timer(0, expiresIn).pipe(mergeMapTo(this.auth0.refresh(refreshToken))),
        ),
        map((authorization) => ({ authorization })),
      )
      .subscribe(this.store);
  };
}

export function useAuthorizationManager() {
  const service = useDependency(P9AuthorizationService);

  useLayoutEffect(() => {
    const subscriptions = [service.authorize(), service.scheduleRefresh()];

    return () => {
      subscriptions.forEach((subscription) => subscription.unsubscribe());
    };
  }, [service]);
}

interface P9AuthorizedUserState {
  error?: any;
  isAnonymous: boolean;
  loading: boolean;
  user?: User;
}

export function useAuthorizedUser(): P9AuthorizedUserState {
  const query = useDependency(P9AuthorizationQuery);

  return useObservableState(
    useObservable(() =>
      combineLatest({
        error: query.selectError(),
        isAnonymous: query.isAnonymous$,
        loading: query.selectLoading(),
        user: query.user$,
      }),
    ),
    { error: undefined, isAnonymous: true, loading: false, user: undefined },
  );
}

type P9AuthenticateFn = (credentials: P9PasswordCredentials) => void;

function useAuthenticateFn(): P9AuthenticateFn {
  const service = useDependency(P9AuthorizationService);
  return useCallback((credentials: P9PasswordCredentials) => service.authenticate(credentials), [service]);
}

export function useAuthorizationFacade(): [state: P9AuthorizedUserState, authenticate: P9AuthenticateFn] {
  return [useAuthorizedUser(), useAuthenticateFn()];
}
