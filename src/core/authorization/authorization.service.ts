import jwtDecode from 'jwt-decode';
import { useObservable, useObservableState } from 'observable-hooks';
import { useCallback, useLayoutEffect } from 'react';
import Environment from 'react-native-config';
import { App, Credentials } from 'realm';
import { combineLatest, defer, EMPTY, iif, merge, of, throwError } from 'rxjs';
import { catchError, map, mapTo, switchMap, tap } from 'rxjs/operators';
import { injectable, registry } from 'tsyringe';

import { useDependency } from '../di';
import { whenDefined } from '../operators';
import { P9AuthClient, P9IdToken, P9PasswordCredentials, P9UserAuthorizationError } from './auth-client';
import { P9AuthorizationQuery } from './authorization.query';
import { P9AuthorizationStore, P9User } from './authorization.store';

@injectable()
@registry([{ token: App, useValue: App.getApp(Environment.P9_MONGODB_REALM_APP_ID) }])
export class P9AuthorizationService {
  constructor(
    private store: P9AuthorizationStore,
    private query: P9AuthorizationQuery,
    private app: App,
    private auth: P9AuthClient,
  ) {}

  authenticate = (credentials?: P9PasswordCredentials) => {
    this.auth
      .authenticate(credentials)
      .pipe(map((authorization) => ({ authorization })))
      .subscribe(this.store);
  };

  authorize = () => {
    const currentUser$ = iif(
      () => Boolean(this.app.currentUser),
      of(this.app.currentUser! as P9User),
      defer(() => this.app.logIn(Credentials.anonymous()) as Promise<P9User>),
    );

    const authorizedUser$ = this.query.authorization$.pipe(
      whenDefined(),
      switchMap(({ idToken }) => {
        const { sub }: P9IdToken = jwtDecode(idToken);

        return iif(
          () => this.app.currentUser!.identities.map(({ id }) => id).includes(sub),
          of(this.app.currentUser! as P9User),
          defer(() => this.app.currentUser!.linkCredentials(Credentials.jwt(idToken))).pipe(
            mapTo(this.app.currentUser! as P9User),
            catchError(({ code, message }: P9UserAuthorizationError) => {
              if (code === 2) {
                return defer(() => this.app.logIn(Credentials.jwt(idToken)) as Promise<P9User>).pipe(
                  tap((user) => this.app.switchUser(user)),
                );
              }

              return throwError(() => new Error(message));
            }),
          ),
        );
      }),
    );

    return merge(currentUser$, authorizedUser$)
      .pipe(map((user) => ({ user })))
      .subscribe(this.store);
  };

  scheduleRefresh = () => {
    return EMPTY.subscribe();
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
  user?: P9User;
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

type P9AuthenticateFn = (credentials?: P9PasswordCredentials) => void;

function useAuthenticateFn(): P9AuthenticateFn {
  const service = useDependency(P9AuthorizationService);
  return useCallback((credentials?: P9PasswordCredentials) => service.authenticate(credentials), [service]);
}

export function useAuthorizationFacade(): [state: P9AuthorizedUserState, authenticate: P9AuthenticateFn] {
  return [useAuthorizedUser(), useAuthenticateFn()];
}
