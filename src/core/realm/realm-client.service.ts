import Environment from 'react-native-config';
import { App, Credentials, User } from 'realm';

export class P9RealmClientService implements App {
  #client: App;

  get allUsers() {
    return this.#client.allUsers;
  }

  get currentUser() {
    return this.#client.currentUser;
  }

  get emailPasswordAuth() {
    return this.#client.emailPasswordAuth;
  }

  get id() {
    return this.#client.id;
  }

  constructor() {
    this.#client = new App({ id: Environment.P9_MONGODB_REALM_APP_ID });
  }

  logIn = (credentials: Credentials) => {
    return this.#client.logIn(credentials);
  };

  switchUser = (user: User) => {
    return this.#client.switchUser(user);
  };

  removeUser = (user: User) => {
    return this.#client.removeUser(user);
  };
}

export function makeRealmClientService(): P9RealmClientService {
  return new P9RealmClientService();
}
