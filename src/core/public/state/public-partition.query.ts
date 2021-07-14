import { CollectionChangeCallback, Results } from 'realm';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { Query } from '@datorama/akita';

import { P9MagicCard, P9MagicCardSchema } from '../schema/magic-card';
import { P9PublicPartitionState, P9PublicPartitionStore } from './public-partition.store';

@singleton()
export class P9PublicPartitionQuery extends Query<P9PublicPartitionState> {
  partition$ = this.select(({ partition }) => partition);
  magicCards$ = this.select(({ magicCards }) => magicCards).pipe(watchCollection());

  constructor(store: P9PublicPartitionStore) {
    super(store);
  }

  magicCardById = (id: string) =>
    this.getValue().partition?.objectForPrimaryKey<P9MagicCard>(P9MagicCardSchema.name, id);
}

export function watchCollection<T>(): MonoTypeOperatorFunction<Results<T> | undefined> {
  return (source$) =>
    source$.pipe(
      switchMap(
        (results) =>
          new Observable<Results<T> | undefined>((subscriber) => {
            const callback: CollectionChangeCallback<T> = (collection) => subscriber.next(collection.snapshot());

            subscriber.next(results?.snapshot());
            results?.addListener(callback);

            return () => {
              subscriber.next(undefined);
              results?.removeListener(callback);
            };
          }),
      ),
    );
}
