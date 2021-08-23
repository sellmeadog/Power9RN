import Auth0, { PasswordRealmParams } from 'react-native-auth0';
import Environment from 'react-native-config';
import { defer, Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { injectable, registry } from 'tsyringe';

export type P9PasswordCredentials = Pick<PasswordRealmParams, 'username' | 'password'>;
export interface P9PasswordAuthorization {
  expiresIn: number;
  idToken: string;
  refreshToken: string;
}

@injectable()
@registry([
  {
    token: Auth0,
    useFactory: () =>
      new Auth0({
        clientId: Environment.P9_AUTH0_CLIENT_ID,
        domain: Environment.P9_AUTH0_DOMAIN,
      }),
  },
])
export class P9Auth0Client {
  constructor(private client: Auth0) {}

  authenticate = (credentials: P9PasswordCredentials): Observable<P9PasswordAuthorization> => {
    return defer(() =>
      this.client.auth.passwordRealm({
        ...credentials,
        realm: 'Username-Password-Authentication',
        scope: Environment.P9_AUTH0_SCOPES,
      }),
    ).pipe(
      retry(3),
      map(({ expiresIn, idToken, refreshToken }) => ({ expiresIn, idToken, refreshToken: refreshToken! })),
    );
  };

  refresh = (refreshToken: string): Observable<P9PasswordAuthorization> => {
    return defer(() => this.client.auth.refreshToken({ refreshToken, scope: Environment.P9_AUTH0_SCOPES })).pipe(
      retry(3),
      map(({ expiresIn, idToken, refreshToken: refreshToken_ }) => ({
        expiresIn,
        idToken,
        refreshToken: refreshToken_!,
      })),
    );
  };
}
