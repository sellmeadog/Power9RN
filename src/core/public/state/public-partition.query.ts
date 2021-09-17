import { useObservable, useObservableState } from 'observable-hooks';
import { CollectionChangeCallback, ConnectionNotificationCallback, ProgressNotificationCallback, Results } from 'realm';
import { combineLatest, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { Query } from '@datorama/akita';

import { useDependency } from '../../di';
import { P9MagicCard, P9MagicCardSchema } from '../schema/magic-card';
import { P9PublicPartitionState, P9PublicPartitionStore } from './public-partition.store';

@singleton()
export class P9PublicPartitionQuery extends Query<P9PublicPartitionState> {
  partition$ = this.select(({ partition }) => partition);

  connectionStatus$ = this.partition$.pipe(
    switchMap(
      (partition) =>
        new Observable<'connected' | 'connecting' | 'disconnected'>((subscriber) => {
          const connectionCallback: ConnectionNotificationCallback = (status) => subscriber.next(status);

          subscriber.next('disconnected');
          partition?.syncSession?.addConnectionNotification(connectionCallback);

          return () => {
            partition?.syncSession?.removeConnectionNotification(connectionCallback);
          };
        }),
    ),
  );

  downloadProgress$ = this.partition$.pipe(
    switchMap(
      (partition) =>
        new Observable<number>((subscriber) => {
          const progressCallback: ProgressNotificationCallback = (transferred, transferable) => {
            if (transferred > 0) {
              subscriber.next(transferred / transferable);

              if (transferred / transferable === 1) {
                subscriber.complete();
              }
            }
          };

          partition?.syncSession?.addProgressNotification('download', 'forCurrentlyOutstandingWork', progressCallback);

          return () => {
            partition?.syncSession?.removeProgressNotification(progressCallback);
          };
        }),
    ),
  );

  isEmpty$ = this.partition$.pipe(map((partition) => partition?.empty ?? true));

  magicCards$ = this.select(({ magicCards }) => magicCards).pipe(watchCollection());

  partitionMetadata$ = combineLatest({
    connectionStatus: this.connectionStatus$,
    downloadProgress: this.downloadProgress$,
    isEmpty: this.isEmpty$,
  });

  constructor(store: P9PublicPartitionStore) {
    super(store);
  }

  findMagicCard = (id: string) =>
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

export const useDownloadProgress = () => {
  const query = useDependency(P9PublicPartitionQuery);

  return useObservableState(
    useObservable(() => combineLatest({ loading: query.selectLoading(), progress: query.downloadProgress$ })),
    { loading: true, progress: 0 },
  );
};

export const usePublicPartitionMetadata = () => {
  const query = useDependency(P9PublicPartitionQuery);

  return useObservableState(query.partitionMetadata$, {
    connectionStatus: 'disconnected',
    downloadProgress: 0,
    isEmpty: true,
  });
};
