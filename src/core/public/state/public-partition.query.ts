import { CollectionChangeCallback, Results } from 'realm';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Query } from '@datorama/akita';

import { P9PublicPartitionState, P9PublicPartitionStore } from './public-partition.store';

export class P9PublicPartitionQuery extends Query<P9PublicPartitionState> {
  magicCards$ = this.select(({ magicCards }) => magicCards).pipe(watchCollection());

  constructor(store: P9PublicPartitionStore) {
    super(store);
  }
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
              console.debug('Removing P9MagicCard change callback');

              subscriber.next(undefined);
              results?.removeListener(callback);
            };
          }),
      ),
    );
}
