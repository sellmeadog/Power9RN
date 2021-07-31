import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { singleton } from 'tsyringe';
import { v1 } from 'uuid';

import { ID } from '@datorama/akita';

import { P9UserDecklist, P9UserDecklistSchema } from '../../../core/data-user';
import { P9UserDataPartitionQuery } from '../../../core/data-user/state/user-data-partition.query';
import { P9UserDataPartitionService } from '../../../core/data-user/state/user-data-partition.service';
import { useDependency } from '../../../core/di';
import { whenDefined } from '../../../core/operators';
import { P9User } from '../../authorization/state/authorization.store';
import { P9CreateDecklistInfo } from '../../decklist-parse';
import { P9UserDecklistFeatureQuery } from './decklist-feature.query';
import { P9UserDecklistFeatureStore } from './decklist-feature.store';

@singleton()
export class P9UserDecklistFeatureService {
  get createDecklistUIState() {
    return this.query.createDecklistUIState$;
  }

  get homeScreenState() {
    return this.query.homeScreenState$;
  }

  constructor(
    private store: P9UserDecklistFeatureStore,
    private query: P9UserDecklistFeatureQuery,
    private dataQuery: P9UserDataPartitionQuery,
    private dataService: P9UserDataPartitionService,
  ) {}

  loadUserDecklists = () => {
    this.dataQuery.partition$
      .pipe(
        switchMap((realm) => of(realm?.objects<P9UserDecklist>(P9UserDecklistSchema.name))),
        whenDefined(),
      )
      .subscribe((results) => {
        this.store.set(results.slice());
      });
  };

  createDecklist = async (user: P9User) => {
    if (!user?.id) {
      throw new Error('Cannot create a decklist for an anonymous user.');
    }

    const decklistInfo = this.store.getValue().ui.decklistInfo;

    if (decklistInfo) {
      const { manualEntries: _, parsedEntries: __, ...rest } = decklistInfo;
      const now = DateTime.utc().toSeconds();

      this.store.add(
        await this.dataService.createUserDecklist({
          _id: v1(),
          _partition: user.id,
          ...rest,
          createdAt: now,
          entries: [],
          isPublic: false,
          modifiedOn: now,
          metadata: { maindeck: 0, sideboard: 0 },
        }),
      );
    }
  };

  activateDecklist = (id: ID) => {
    this.store.setActive(id);
  };

  removeDecklist = (entity: P9UserDecklist) => {
    this.store.remove(entity._id);
    this.dataService.removeObject(P9UserDecklistSchema, entity._id);
  };

  initCreateDecklistUI = () => {
    this.store.update((draft) => {
      draft.ui.decklistInfo = { name: '', formatId: 'casual', description: '' };
    });

    return () => {
      this.store.update((draft) => {
        draft.ui.decklistInfo = undefined;
      });
    };
  };

  updateCreateDecklistUI = <K extends keyof P9CreateDecklistInfo>(key: K, value: P9CreateDecklistInfo[K]) => {
    this.store.update((draft) => {
      draft.ui.decklistInfo![key] = value;
    });
  };
}

export function useUserDecklistFeatureService() {
  return useDependency(P9UserDecklistFeatureService);
}
