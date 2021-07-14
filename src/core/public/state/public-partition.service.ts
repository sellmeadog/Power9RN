import Realm, { Results, User } from 'realm';
import { singleton } from 'tsyringe';

import { etl_scryfall } from '../../etl';
import { P9MagicCard, P9MagicCardSchema } from '../schema/magic-card';
import { P9MagicCardFaceSchema } from '../schema/magic-card-face';
import { P9MagicCardImageMapSchema } from '../schema/magic-card-image-map';
import { P9MagicCardPartSchema } from '../schema/magic-card-part';
import { P9MagicCardPreviewSchema } from '../schema/magic-card-preview';
import { P9MagicSetSchema } from '../schema/magic-set';
import { P9UserHandleSchema } from '../schema/user-handle';
import { P9PublicPartitionQuery } from './public-partition.query';
import { P9PublicPartitionStore } from './public-partition.store';

export const P9_PUBLIC_SCHEMA = [
  P9MagicCardFaceSchema,
  P9MagicCardImageMapSchema,
  P9MagicCardPartSchema,
  P9MagicCardPreviewSchema,
  P9MagicCardSchema,
  P9MagicSetSchema,
  P9UserHandleSchema,
];

@singleton()
export class P9PublicPartitionService {
  #partition: Realm | undefined;
  #magic_cards: Results<P9MagicCard & Realm.Object> | undefined;

  constructor(private store: P9PublicPartitionStore) {}

  open = (user: User): void => {
    if (!this.#partition || this.#partition.isClosed) {
      console.debug(`Opening PUBLIC partition for ${user.id}...`);
      this.#partition = new Realm({ schema: P9_PUBLIC_SCHEMA, sync: { partitionValue: 'PUBLIC', user } });
      this.#magic_cards = this.#partition.objects<P9MagicCard>(P9MagicCardSchema.name).sorted([['name', false]]);

      this.store.next({ partition: this.#partition, magicCards: this.#magic_cards });
      console.debug('PUBLIC partition opened.');
    } else {
      console.warn(`PUBLIC partition for ${user.id} is already open`);
    }
  };

  close = (): void => {
    console.debug('Closing PUBLIC partition...');
    const partition = this.#partition;

    this.store.next({ partition: undefined, magicCards: undefined });
    this.#partition = undefined;
    this.#magic_cards = undefined;

    partition?.close();
    console.debug('PUBLIC partition closed.');
  };

  etl = () => {
    etl_scryfall().forEach((batch) => {
      try {
        this.#partition?.beginTransaction();
        batch.forEach((entity) => this.#partition?.create(P9MagicCardSchema.name, entity, Realm.UpdateMode.All));
        this.#partition?.commitTransaction();
        console.log(`Wrote ${batch.length} magic cards in batch`);
      } catch (error) {
        console.log(error);
        this.#partition?.cancelTransaction();
      }
    });
  };

  magicCardById = (id: string): P9MagicCard | undefined => {
    return this.#partition?.objectForPrimaryKey<P9MagicCard>(P9MagicCardSchema.name, id);
  };
}

export type P9PartitionServiceTuple = [query: P9PublicPartitionQuery, service: P9PublicPartitionService];
