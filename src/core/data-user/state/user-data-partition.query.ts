import { CollectionChangeCallback, ConnectionNotificationCallback, Results } from 'realm';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Lifecycle, scoped } from 'tsyringe';

import { Query } from '@datorama/akita';

import { P9UserDataPartitionState, P9UserDataPartitionStore } from './user-data-partition.store';

@scoped(Lifecycle.ContainerScoped)
export class P9UserDataPartitionQuery extends Query<P9UserDataPartitionState> {
  partition$ = this.select(({ partition }) => partition);
  decklists$ = this.select(({ decklists }) => decklists).pipe(watchCollection());

  connectionStatus$ = this.partition$.pipe(
    switchMap(
      (partition) =>
        new Observable<'connected' | 'connecting' | 'disconnected'>((subscriber) => {
          const connectionCallback: ConnectionNotificationCallback = (status) => {
            // console.log('USER partition sync session is', status);
            subscriber.next(status);
          };

          subscriber.next('disconnected');
          partition?.syncSession?.addConnectionNotification(connectionCallback);

          return () => {
            partition?.syncSession?.removeConnectionNotification(connectionCallback);
          };
        }),
    ),
  );

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
            // console.log('[UserDecklist]: Subscribing to changes...');
            const callback: CollectionChangeCallback<T> = (collection) => {
              // console.log('[UserDecklist]: Receiving changes...');
              subscriber.next(collection.snapshot());
              // console.log('[UserDecklist]: Changes published');
            };

            subscriber.next(results?.snapshot());
            results?.addListener(callback);
            // console.log('[UserDecklist]: Subscribed');

            return () => {
              subscriber.next(undefined);
              results?.removeListener(callback);
              // console.log('[UserDecklist]: Unsubscribed');
            };
          }),
      ),
    );
}
