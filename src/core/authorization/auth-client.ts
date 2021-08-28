import Auth0, { PasswordRealmParams } from 'react-native-auth0';
import Environment from 'react-native-config';
import { defer, Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { injectable, registry } from 'tsyringe';

export type P9PasswordCredentials = Pick<PasswordRealmParams, 'username' | 'password'>;

export interface P9UserAuthorization {
  expiresIn: number;
  idToken: string;
  refreshToken: string;
}

export interface P9UserAuthorizationError {
  code: number;
  message: string;
}

export interface P9IdToken {
  aud: string;
  email: string;
  email_verified: boolean;
  exp: number;
  iat: number;
  iss: string;
  name: string;
  nickname: string;
  picture: string;
  sub: string;
  updated_at: string;
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
export class P9AuthClient {
  constructor(private client: Auth0) {}

  authenticate = (credentials?: P9PasswordCredentials): Observable<P9UserAuthorization> => {
    return defer(() =>
      credentials
        ? this.client.auth.passwordRealm({
            ...credentials,
            realm: 'Username-Password-Authentication',
            scope: Environment.P9_AUTH0_SCOPES,
          })
        : this.client.webAuth.authorize({ scope: Environment.P9_AUTH0_SCOPES }),
    ).pipe(
      retry(3),
      map(({ expiresIn, idToken, refreshToken }) => ({ expiresIn, idToken, refreshToken: refreshToken! })),
    );
  };

  refresh = (refreshToken: string): Observable<P9UserAuthorization> => {
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
