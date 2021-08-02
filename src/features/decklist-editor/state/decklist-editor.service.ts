import { DateTime } from 'luxon';
import { useObservableState } from 'observable-hooks';
import { useCallback, useEffect } from 'react';
import { Subscription } from 'rxjs';
import { debounceTime, skip } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { arrayUpdate, arrayUpsert } from '@datorama/akita';

import { P9DecklistEntryType, P9UserDecklist, P9UserDecklistSchema } from '../../../core/data-user';
import { P9UserDataPartitionService } from '../../../core/data-user/state/user-data-partition.service';
import { useDependency } from '../../../core/di';
import { whenDefined } from '../../../core/operators';
import { P9MagicCard } from '../../../core/public';
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
        .pipe(whenDefined(), skip(1), debounceTime(500))
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

  upsertEntry = (
    { oracle_id: id, _id: cardId, card_faces, color_identity }: P9MagicCard,
    entryType: P9DecklistEntryType,
  ) => {
    this.store.updateActive((draft) => {
      const entry = draft.entries.find((item) => item.id === id);

      if (draft.entries.length === 0) {
        draft.metadata.defaultCardArtworkUri = card_faces[0].image_uris?.art_crop;
        draft.metadata.defaultCardId = cardId;
      }

      color_identity?.forEach((color) => {
        draft.metadata[color] = (draft.metadata[color] ?? 0) + 1;
      });

      draft.entries = arrayUpsert(draft.entries, id, { id, cardId, [entryType]: (entry?.[entryType] ?? 0) + 1 }, 'id');
      updateMetadata(draft);
    });
  };

  updateEntryCount = (entryId: string, entryType: P9DecklistEntryType, count: number) => {
    this.store.updateActive((draft) => {
      draft.entries = arrayUpdate(draft.entries, entryId, { [entryType]: count });
      updateMetadata(draft);
    });
  };
}

function updateMetadata(draft: P9UserDecklist) {
  draft.metadata.maindeck = draft.entries.reduce((sum, { maindeck = 0 }) => sum + maindeck, 0);
  draft.metadata.sideboard = draft.entries.reduce((sum, { sideboard = 0 }) => sum + sideboard, 0);
  draft.modifiedOn = DateTime.local().toSeconds();
}

export function useDecklistEditorFacade(): [
  state: P9DecklistEditorState,
  updateFn: <K extends keyof P9DecklistEditorUIState>(key: K, value: P9DecklistEditorUIState[K]) => void,
  upsertEntryFn: (magicCard: P9MagicCard, entryType: P9DecklistEntryType) => void,
] {
  const service = useDependency(P9DecklistEditorService);

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
  ];
}
