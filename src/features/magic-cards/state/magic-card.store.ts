import { Observer } from 'rxjs';

import { Store } from '@datorama/akita';

import { P9PublicPartitionQuery } from '../../../core/public/state/public-partition.query';
import { P9MagicCardFilterQuery } from '../../magic-card-filter';
import { P9MagicCardGalleryQuery } from './magic-card.query';

export interface P9MagicCardGalleryState {
  keywordExpression?: string;
}

export class P9MagicCardGalleryStore
  extends Store<P9MagicCardGalleryState>
  implements Observer<Partial<P9MagicCardGalleryState>>
{
  constructor() {
    super({}, { name: 'magic-card-gallery' });
  }

  next = (value: Partial<P9MagicCardGalleryState>): void => {
    this.update((state) => ({ ...state, ...value }));
  };

  error = (error: unknown): void => {
    this.setError(error);
    this.setLoading(false);
  };

  complete = (): void => {
    this.setLoading(false);
  };
}

export type P9MagicCardGalleryStateTuple = [store: P9MagicCardGalleryStore, query: P9MagicCardGalleryQuery];

export function makeMagicCardGalleryStore(
  partitionQuery: P9PublicPartitionQuery,
  filterQuery: P9MagicCardFilterQuery,
): P9MagicCardGalleryStateTuple {
  const store = new P9MagicCardGalleryStore();
  const query = new P9MagicCardGalleryQuery(store, partitionQuery, filterQuery);

  return [store, query];
}
