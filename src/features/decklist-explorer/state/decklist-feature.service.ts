import { map } from 'rxjs/operators';
import { Lifecycle, scoped } from 'tsyringe';
import { v1 } from 'uuid';

import { arrayUpsert, ID } from '@datorama/akita';

import { P9User } from '../../../core/authorization';
import { P9DocumentInfo, P9UserDecklist, P9UserDecklistSchema } from '../../../core/data-user';
import { P9UserDecklistEntry } from '../../../core/data-user/schema/user-decklist-entry';
import { P9UserDataPartitionQuery } from '../../../core/data-user/state/user-data-partition.query';
import { P9UserDataPartitionService } from '../../../core/data-user/state/user-data-partition.service';
import { useDependency } from '../../../core/di';
import { whenDefined } from '../../../core/operators';
import { P9MagicCardObject } from '../../../core/public';
import { P9PublicPartitionService } from '../../../core/public/state/public-partition.service';
import { UTC_NOW } from '../../../core/utils';
import { P9CreateDecklistEntryInfo, P9CreateDecklistInfo, parseDocument } from '../../decklist-parse';
import { P9GameFormatType } from './decklist-feature.model';
import { P9UserDecklistFeatureQuery } from './decklist-feature.query';
import { P9UserDecklistFeatureStore } from './decklist-feature.store';

@scoped(Lifecycle.ContainerScoped)
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
  ) {
    this.dataQuery.decklists$
      .pipe(
        whenDefined(),
        map((results) => results.toJSON() as P9UserDecklist[]),
      )
      .forEach((data) => this.store.upsertMany(data));
  }

  createDecklist = async (user: P9User) => {
    if (!user?.id) {
      throw new Error('Cannot create a decklist for an anonymous user.');
    }

    const decklistInfo = this.store.getValue().ui.decklistInfo;

    if (decklistInfo) {
      const { manualEntries: _, parsedEntries = [], ...rest } = decklistInfo;
      const now = UTC_NOW();

      const tuples = this.makeEntryTuples(parsedEntries);
      const entries = tuples.map(([entry]) => entry);
      const maindeckEntries = tuples.filter(([{ maindeck }]) => Boolean(maindeck)).map(([entry]) => entry);
      const maindeckCards = tuples.filter(([{ maindeck }]) => Boolean(maindeck)).map(([__, magicCard]) => magicCard!);
      const sideboardEntries = tuples.filter(([{ sideboard }]) => Boolean(sideboard)).map(([entry]) => entry);

      const decklist = await this.dataService.createUserDecklist({
        _id: v1(),
        _partition: user.id,
        ...rest,
        createdAt: now,
        entries,
        isPublic: false,
        modifiedOn: now,
        metadata: {
          defaultCardArtworkUri: maindeckCards[0]?.card_faces[0].image_uris?.art_crop ?? null,
          defaultCardId: maindeckCards[0]?._id ?? null,
          maindeck: maindeckEntries.reduce((sum, { maindeck }) => sum + (maindeck ?? 0), 0),
          sideboard: sideboardEntries.reduce((sum, { sideboard }) => sum + (sideboard ?? 0), 0),
          W: countManaSymbol(entries, 'W'),
          U: countManaSymbol(entries, 'U'),
          B: countManaSymbol(entries, 'B'),
          R: countManaSymbol(entries, 'R'),
          G: countManaSymbol(entries, 'G'),
          C: countManaSymbol(entries, 'C'),
        },
      });

      this.store.add(decklist);

      return decklist;
    }

    return null;

    function countManaSymbol(entries: P9UserDecklistEntry[], symbol: 'W' | 'U' | 'B' | 'R' | 'G' | 'C'): number {
      return entries.filter(({ colors = ['C'], maindeck }) => Boolean(maindeck) && Array.from(colors).includes(symbol))
        .length;
    }
  };

  activateDecklist = (id: ID) => {
    this.store.setActive(id);
  };

  activateDecklistSection = (type: P9GameFormatType) => {
    this.store.update((draft) => {
      draft.ui.activeDecklistSection = type;
    });
  };

  removeDecklist = (entity: P9UserDecklist) => {
    this.store.remove(entity._id);
    this.dataService.removeObject(P9UserDecklistSchema, entity._id);
  };

  initCreateDecklistUI = (decklistInfo: P9CreateDecklistInfo = { name: '', formatId: 'casual', description: '' }) => {
    this.store.update((draft) => {
      draft.ui.decklistInfo = decklistInfo;
    });

    return () => {
      this.deactivateCreateDecklistUI();
    };
  };

  importCreateDecklistUI = async (documentInfo: P9DocumentInfo) => {
    const { manualEntries, name, parsedEntries } = await parseDocument(documentInfo);

    this.initCreateDecklistUI();
    this.updateCreateDecklistUI('manualEntries', manualEntries);
    this.updateCreateDecklistUI('name', name);
    this.updateCreateDecklistUI('parsedEntries', parsedEntries);
  };

  deactivateCreateDecklistUI = () => {
    this.store.update((draft) => {
      draft.ui.decklistInfo = undefined;
    });
  };

  updateCreateDecklistUI = <K extends keyof P9CreateDecklistInfo>(key: K, value: P9CreateDecklistInfo[K]) => {
    this.store.update((draft) => {
      draft.ui.decklistInfo![key] = value;
    });
  };

  private findCards(parsedEntries: P9CreateDecklistEntryInfo[]): (P9MagicCardObject | undefined)[] {
    return parsedEntries.map((info) => {
      return this.publicDataService.findMagicCard(info.cardName, info.expansionCode, info.collectorNumber);
    });
  }

  private findEntries(
    parsedEntries: P9CreateDecklistEntryInfo[],
    magicCards: (P9MagicCardObject | undefined)[],
  ): P9UserDecklistEntry[] {
    return parsedEntries
      .map((info, index): P9UserDecklistEntry | undefined => {
        const magicCard = magicCards[index];
        const colorsSet = Array.from(magicCard?.card_faces[0].types ?? []).includes('Land')
          ? new Set<string>()
          : magicCard?.card_faces.reduce(
              (set, { colors }) =>
                colors.length === 0 ? set.add('C') : colors.reduce((set_, color) => set_.add(color), set),
              new Set<string>(),
            ) ?? new Set('C');

        if (magicCard) {
          return {
            id: magicCard.oracle_id,
            cardId: magicCard._id,
            colors: Array.from(colorsSet),
            [info.type]: Number(info.count),
          };
        }

        return undefined;
      })
      .filter((entry): entry is P9UserDecklistEntry => Boolean(entry))
      .reduce((acc, curr) => {
        return arrayUpsert(acc, curr.id, curr);
      }, [] as P9UserDecklistEntry[]);
  }

  private makeEntryTuples(
    parsedEntries: P9CreateDecklistEntryInfo[],
  ): [entry: P9UserDecklistEntry, magicCard: P9MagicCardObject | undefined][] {
    const magicCards = this.findCards(parsedEntries);
    const entries = this.findEntries(parsedEntries, magicCards);

    return entries.map((entry) => [entry, magicCards.find((magicCard) => magicCard?._id === entry.cardId)]);
  }
}

export function useUserDecklistFeatureService() {
  return useDependency(P9UserDecklistFeatureService);
}
