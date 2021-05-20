import { App, Credentials, User } from 'realm';

export class P9RealmClientService implements Pick<App, 'currentUser' | 'logIn' | 'switchUser'> {
  #client: App;

  get currentUser() {
    return this.#client.currentUser;
  }

  constructor() {
    this.#client = new App({ id: 'aws_power9_dev-klmts' });
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
