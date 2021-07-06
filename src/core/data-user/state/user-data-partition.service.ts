import Realm, { ObjectSchema, Results, User } from 'realm';
import { singleton } from 'tsyringe';

import { P9UserDecklist, P9UserDecklistSchema } from '../schema/user-decklist';
import { P9UserDecklistEntrySchema } from '../schema/user-decklist-entry';
import { P9UserDataPartitionQuery } from './user-data-partition.query';
import { P9UserDataPartitionStore } from './user-data-partition.store';

export const P9_USER_DATA_SCHEMA = [P9UserDecklistEntrySchema, P9UserDecklistSchema];

@singleton()
export class P9UserDataPartitionService {
  #partition: Realm | undefined;
  #decklists: Results<{}> | undefined;

  get partition$() {
    return this.query.partition$;
  }

  constructor(private store: P9UserDataPartitionStore, private query: P9UserDataPartitionQuery) {}

  open = (user: User): void => {
    if (user.providerType === 'anon-user') {
      console.log('User is anonymous');
      return;
    }

    if (!this.#partition || this.#partition.isClosed) {
      console.debug(`Opening USER partition for ${user.id}...`);
      this.#partition = new Realm({ schema: P9_USER_DATA_SCHEMA, sync: { partitionValue: user.id, user } });
      this.#decklists = this.#partition.objects<P9UserDecklist>(P9UserDecklistSchema.name).sorted([['name', false]]);

      this.store.next({ partition: this.#partition, decklists: this.#decklists });
      console.debug('USER partition opened.');
    } else {
      console.warn(`USER partition for ${user.id} is already open`);
    }
  };

  close = (): void => {
    console.debug('Closing USER partition...');
    const partition = this.#partition;

    this.store.next({ partition: undefined, decklists: undefined });
    this.#partition = undefined;
    this.#decklists = undefined;

    partition?.close();
    console.debug('USER partition closed.');
  };

  createObject = async <T>({ name }: ObjectSchema, entity: T): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (!this.#partition) {
        return reject(new Error('An open and writable partition is not available.'));
      }

      try {
        this.#partition.beginTransaction();
        resolve(this.#partition.create(name, entity, Realm.UpdateMode.All));
        this.#partition.commitTransaction();
      } catch (error) {
        this.#partition.cancelTransaction();
        reject(error);
      }
    });
  };

  createUserDecklist = async (entity: P9UserDecklist) => {
    return this.createObject(P9UserDecklistSchema, entity);
  };

  removeObject = <T>(entity: T) => {
    try {
      this.#partition?.beginTransaction();
      this.#partition?.delete(entity);
      this.#partition?.commitTransaction();
    } catch {
      this.#partition?.cancelTransaction();
    }
  };
}
