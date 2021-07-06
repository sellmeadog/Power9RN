import { CollectionChangeCallback, Results } from 'realm';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { injectable } from 'tsyringe';

import { Query } from '@datorama/akita';

import { P9UserDataPartitionState, P9UserDataPartitionStore } from './user-data-partition.store';

@injectable()
export class P9UserDataPartitionQuery extends Query<P9UserDataPartitionState> {
  partition$ = this.select(({ partition }) => partition);
  decklists$ = this.select(({ decklists }) => decklists).pipe(watchCollection());

  constructor(store: P9UserDataPartitionStore) {
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
              subscriber.next(undefined);
              results?.removeListener(callback);
            };
          }),
      ),
    );
}
