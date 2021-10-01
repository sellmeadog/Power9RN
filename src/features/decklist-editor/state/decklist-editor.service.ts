import { useObservableState } from 'observable-hooks';
import { useCallback, useEffect } from 'react';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilKeyChanged, skip, tap } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { arrayUpdate, arrayUpsert } from '@datorama/akita';
import { useNavigation } from '@react-navigation/core';

import { P9DecklistEntryType, P9UserDecklist, P9UserDecklistSchema } from '../../../core/data-user';
import { P9UserDataPartitionService } from '../../../core/data-user/state/user-data-partition.service';
import { useDependency } from '../../../core/di';
import { whenDefined } from '../../../core/operators';
import { P9MagicCard } from '../../../core/public';
import { UTC_NOW } from '../../../core/utils';
import { P9UserDecklistFeatureStore } from '../../decklist-explorer/state';
import { P9DecklistEditorUIState } from '../../decklist-explorer/state/decklist-feature.model';
import { P9DecklistEditorState } from '../decklist-editor.model';
import { P9DecklistEditorQuery } from './decklist-editor.query';

@singleton()
export class P9DecklistEditorService {
  #subscription: Subscription | undefined;

  constructor(
    private store: P9UserDecklistFeatureStore,
    public query: P9DecklistEditorQuery,
    private dataService: P9UserDataPartitionService,
  ) {}

  activateEditorUI = () => {
    this.store.update((draft) => {
      draft.ui.decklistEditorState = { activeEntryType: 'maindeck', activeEntryId: undefined };
    });

    return () => {
      if (this.query.hasActive()) {
        this.store.removeActive(this.query.getActiveId());

        this.store.update((draft) => {
          draft.ui.decklistEditorState = undefined;
        });
      }
    };
  };

  activateAutoSave = () => {
    if (!this.#subscription) {
      this.#subscription = this.query
        .selectActive()
        .pipe(
          whenDefined(),
          skip(1),
          debounceTime(500),
          distinctUntilKeyChanged('modifiedOn'),
          tap(({ name, modifiedOn }) => console.log(`Autosaving ${name} at ${modifiedOn}`)),
        )
        .subscribe((entity) => this.dataService.createObject(P9UserDecklistSchema, entity));
    }

    return () => {
      if (this.#subscription) {
        this.#subscription?.unsubscribe();
        this.#subscription = undefined;
      }
    };
  };

  activateDecklistEntry = (entryId: string) => {
    this.updateEditorUIState('activeEntryId', entryId);
  };

  updateEditorUIState = <K extends keyof P9DecklistEditorUIState>(key: K, value: P9DecklistEditorUIState[K]) => {
    this.store.update((draft) => {
      draft.ui.decklistEditorState![key] = value;
    });
  };

  upsertEntry = ({ oracle_id: id, _id: cardId, card_faces }: P9MagicCard, entryType: P9DecklistEntryType) => {
    this.store.updateActive((draft) => {
      const entry = draft.entries.find((item) => item.id === id);

      if (draft.entries.length === 0) {
        draft.metadata.defaultCardArtworkUri = card_faces[0].image_uris?.art_crop ?? undefined;
        draft.metadata.defaultCardId = cardId;
      }

      const colorSet = Array.from(card_faces[0].types).includes('Land')
        ? new Set<string>()
        : card_faces.reduce(
            (set, { colors }) =>
              colors.length === 0 ? set.add('C') : colors.reduce((set_, color) => set_.add(color), set),
            new Set<string>(),
          );

      draft.entries = arrayUpsert(
        draft.entries,
        id,
        { id, cardId, colors: Array.from(colorSet), [entryType]: (entry?.[entryType] ?? 0) + 1 },
        'id',
      );
      updateMetadata(draft);
    });
  };

  updateEntryCount = (entryId: string, entryType: P9DecklistEntryType, count: number) => {
    this.store.updateActive((draft) => {
      draft.entries = arrayUpdate(draft.entries, entryId, { [entryType]: count });
      updateMetadata(draft);
    });
  };

  updateEntryPrinting(entryId: string, cardId: string) {
    this.store.updateActive((draft) => {
      draft.entries = arrayUpdate(draft.entries, entryId, { cardId });
      draft.modifiedOn = UTC_NOW();
    });
  }
}

function updateMetadata(draft: P9UserDecklist) {
  draft.metadata.maindeck = draft.entries.reduce((sum, { maindeck = 0 }) => sum + maindeck, 0);
  draft.metadata.sideboard = draft.entries.reduce((sum, { sideboard = 0 }) => sum + sideboard, 0);
  draft.metadata.W = countColorSymbol('W');
  draft.metadata.U = countColorSymbol('U');
  draft.metadata.B = countColorSymbol('B');
  draft.metadata.R = countColorSymbol('R');
  draft.metadata.G = countColorSymbol('G');
  draft.metadata.C = countColorSymbol('C');
  draft.modifiedOn = UTC_NOW();

  function countColorSymbol(symbol: string): number | undefined {
    return draft.entries.filter(
      ({ colors = ['C'], maindeck }) => Boolean(maindeck) && Array.from(colors).includes(symbol),
    ).length;
  }
}

export function useDecklistEditorFacade(): [
  state: P9DecklistEditorState,
  updateFn: <K extends keyof P9DecklistEditorUIState>(key: K, value: P9DecklistEditorUIState[K]) => void,
  upsertEntryFn: (magicCard: P9MagicCard, entryType: P9DecklistEntryType) => void,
  navigateSettingsFn: () => void,
] {
  const service = useDependency(P9DecklistEditorService);
  const { navigate } = useNavigation();

  useEffect(() => {
    const hanldes = [service.activateEditorUI(), service.activateAutoSave()];

    return () => {
      hanldes.forEach((handle) => handle());
    };
  }, [service]);

  return [
    useObservableState(service.query.editorState$, { name: '' }),
    useCallback(
      <K extends keyof P9DecklistEditorUIState>(key: K, value: P9DecklistEditorUIState[K]) => {
        service.updateEditorUIState(key, value);
      },
      [service],
    ),
    useCallback(
      (magicCard: P9MagicCard, entryType: P9DecklistEntryType) => service.upsertEntry(magicCard, entryType),
      [service],
    ),
    useCallback(() => navigate('P9:Modal:DecklistExplorer:Editor:Settings'), [navigate]),
  ];
}
