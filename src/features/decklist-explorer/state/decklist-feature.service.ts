import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { singleton } from 'tsyringe';
import { v1 } from 'uuid';

import { arrayUpsert, ID } from '@datorama/akita';

import { P9User } from '../../../core/authorization';
import { P9UserDecklist, P9UserDecklistSchema } from '../../../core/data-user';
import { P9UserDecklistEntry } from '../../../core/data-user/schema/user-decklist-entry';
import { P9UserDataPartitionQuery } from '../../../core/data-user/state/user-data-partition.query';
import { P9UserDataPartitionService } from '../../../core/data-user/state/user-data-partition.service';
import { useDependency } from '../../../core/di';
import { whenDefined } from '../../../core/operators';
import { P9PublicPartitionService } from '../../../core/public/state/public-partition.service';
import { P9CreateDecklistEntryInfo, P9CreateDecklistInfo } from '../../decklist-parse';
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
    private publicDataService: P9PublicPartitionService,
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
      const { manualEntries: _, parsedEntries = [], ...rest } = decklistInfo;
      const now = DateTime.utc().toSeconds();

      this.store.add(
        await this.dataService.createUserDecklist({
          _id: v1(),
          _partition: user.id,
          ...rest,
          createdAt: now,
          entries: this.findEntries(parsedEntries),
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

  private findEntries(parsedEntries: P9CreateDecklistEntryInfo[]): P9UserDecklistEntry[] {
    return parsedEntries
      .map((info): P9UserDecklistEntry | undefined => {
        const magicCard = this.publicDataService.findMagicCard(info.cardName, info.expansionCode, info.collectorNumber);

        if (magicCard) {
          return { id: magicCard.oracle_id, cardId: magicCard._id, [info.type]: Number(info.count) };
        }

        return undefined;
      })
      .filter((entry): entry is P9UserDecklistEntry => Boolean(entry))
      .reduce((acc, curr) => {
        return arrayUpsert(acc, curr.id, curr);
      }, [] as P9UserDecklistEntry[]);
  }
}

export function useUserDecklistFeatureService() {
  return useDependency(P9UserDecklistFeatureService);
}
