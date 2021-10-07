import { Observer } from 'rxjs';
import { Lifecycle, scoped } from 'tsyringe';

import { Store } from '@datorama/akita';

import { P9MagicCardGalleryQuery } from './magic-card.query';

export interface P9MagicCardGalleryState {
  keywordExpression?: string;
}

@scoped(Lifecycle.ContainerScoped)
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
