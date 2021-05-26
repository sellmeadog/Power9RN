import Auth0 from 'react-native-auth0';
import Environment from 'react-native-config';
import { Credentials } from 'realm';
import { defer } from 'rxjs';

export class P9AuthorizationClientService {
  #auth0 = new Auth0({
    clientId: Environment.P9_AUTH0_CLIENT_ID,
    domain: Environment.P9_AUTH0_DOMAIN,
  });

  authenticate = (credentials: Credentials.EmailPasswordPayload) => {
    return defer(() =>
      this.#auth0.auth.passwordRealm({
        ...credentials,
        realm: 'Username-Password-Authentication',
        scope: Environment.P9_AUTH0_SCOPES,
      }),
    );
  };
}

export function makeAuthorizationClientService() {
  return new P9AuthorizationClientService();
}
