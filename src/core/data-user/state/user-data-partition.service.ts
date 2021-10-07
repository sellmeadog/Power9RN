import Environment from 'react-native-config';
import Realm, { App, ObjectSchema, Results, User } from 'realm';
import { Lifecycle, scoped } from 'tsyringe';

import { P9UserDecklist, P9UserDecklistSchema } from '../schema/user-decklist';
import { P9UserDecklistEntrySchema, P9UserDecklistMetadataSchema } from '../schema/user-decklist-entry';
import { P9UserDataPartitionQuery } from './user-data-partition.query';
import { P9UserDataPartitionStore } from './user-data-partition.store';

export const P9_USER_DATA_SCHEMA = [P9UserDecklistEntrySchema, P9UserDecklistMetadataSchema, P9UserDecklistSchema];

@scoped(Lifecycle.ContainerScoped)
export class P9UserDataPartitionService {
  #config: Realm.Configuration | undefined;
  #partition: Realm | undefined;
  #decklists: Results<P9UserDecklist> | undefined;

  get partition$() {
    return this.query.partition$;
  }

  constructor(private store: P9UserDataPartitionStore, private query: P9UserDataPartitionQuery) {}

  open = (user: User): void => {
    if (
      user.identities.map((identity) => identity.providerType).every((providerType) => providerType === 'anon-user')
    ) {
      return;
    }

    if (!this.#partition || this.#partition.isClosed) {
      this.#config = {
        schema: P9_USER_DATA_SCHEMA,
        sync: {
          partitionValue: user.id,
          user,
          error: (_, reason) => {
            if (this.#partition) {
              if (reason.name === 'ClientReset') {
                const partition = this.#partition;

                this.close();
                this._reset(partition);
                this._open();
              }
            }
          },
        },
      };

      this._open();
    }
  };

  close = (): void => {
    const partition = this.#partition;

    this.store.next({ partition: undefined, decklists: undefined });
    this.#partition = undefined;
    this.#decklists = undefined;

    partition?.close();
  };

  createObject = async <T>({ name }: ObjectSchema, entity: T): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (!this.#partition) {
        return reject(new Error('An open and writable partition is not available.'));
      }

      this.#partition.write(() => {
        try {
          resolve(this.#partition!.create(name, entity, Realm.UpdateMode.All));
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  createUserDecklist = async (entity: P9UserDecklist) => {
    return this.createObject(P9UserDecklistSchema, entity);
  };

  removeObject = <T>({ name }: ObjectSchema, id: string) => {
    if (!this.#partition) {
      throw new Error('An open and writable partition is not available.');
    }

    this.#partition?.write(() => {
      this.#partition?.delete(this.#partition.objectForPrimaryKey(name, id));
    });
  };

  private _reset(partition: Realm) {
    if (!partition.isClosed) {
      App.Sync.initiateClientReset(App.getApp(Environment.P9_MONGODB_REALM_APP_ID), partition.path);
    }
  }

  private _open() {
    this.#partition = new Realm(this.#config);
    this.#decklists = this.#partition.objects<P9UserDecklist>(P9UserDecklistSchema.name).sorted([['name', false]]);

    this.store.next({ partition: this.#partition, decklists: this.#decklists });
  }

  pauseSync() {
    this.#partition?.syncSession?.pause();
  }

  resumeSync() {
    this.#partition?.syncSession?.resume();
  }
}
