import Environment from 'react-native-config';
import { App, Credentials, User } from 'realm';

export class P9RealmClientService implements Pick<App, 'currentUser' | 'logIn' | 'switchUser'> {
  #client: App;

  get currentUser() {
    return this.#client.currentUser;
  }

  constructor() {
    this.#client = new App({ id: Environment.P9_MONGODB_REALM_APP_ID });
  }

  logIn(credentials: Credentials) {
    return this.#client.logIn(credentials);
  }

  switchUser(user: User) {
    this.#client.switchUser(user);
  }
}

export function makeRealmClientService(): P9RealmClientService {
  return new P9RealmClientService();
}
