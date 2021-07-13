import { useObservableState } from 'observable-hooks';
import { useCallback, useEffect } from 'react';
import { singleton } from 'tsyringe';

import { arrayUpsert } from '@datorama/akita';

import { P9DecklistEntryType } from '../../../core/data-user';
import { useDependency } from '../../../core/di';
import { P9MagicCard } from '../../../core/public';
import { P9UserDecklistFeatureStore } from '../../decklist-explorer/state';
import { P9DecklistEditorUIState } from '../../decklist-explorer/state/decklist-feature.model';
import { P9DecklistEditorState } from '../decklist-editor.model';
import { P9DecklistEditorQuery } from './decklist-editor.query';

@singleton()
export class P9DecklistEditorService {
  constructor(private store: P9UserDecklistFeatureStore, public query: P9DecklistEditorQuery) {}

  initializeEditorUIState = () => {
    this.store.update((draft) => {
      draft.ui.decklistEditorState = { activeEntryType: 'maindeck' };
    });

    return () => {
      this.store.update((draft) => {
        draft.ui.decklistEditorState = undefined;
      });
    };
  };

  updateEditorUIState = <K extends keyof P9DecklistEditorUIState>(key: K, value: P9DecklistEditorUIState[K]) => {
    this.store.update((draft) => {
      draft.ui.decklistEditorState![key] = value;
    });
  };

  upsertEntry = (id: string, cardId: string, entryType: P9DecklistEntryType) => {
    this.store.updateActive((draft) => {
      const entry = draft.entries.find((item) => item.id === id);

      draft.entries = arrayUpsert(draft.entries, id, { id, cardId, [entryType]: (entry?.[entryType] ?? 0) + 1 }, 'id');
    });
  };
}

export function useDecklistEditorFacade(): [
  state: P9DecklistEditorState,
  updateFn: <K extends keyof P9DecklistEditorUIState>(key: K, value: P9DecklistEditorUIState[K]) => void,
  upsertEntryFn: (magicCard: P9MagicCard, entryType: P9DecklistEntryType) => void,
] {
  const service = useDependency(P9DecklistEditorService);

  useEffect(() => service.initializeEditorUIState(), [service]);

  return [
    useObservableState(service.query.editorState$, { name: '' }),
    useCallback(
      <K extends keyof P9DecklistEditorUIState>(key: K, value: P9DecklistEditorUIState[K]) => {
        service.updateEditorUIState(key, value);
      },
      [service],
    ),
    useCallback(
      ({ _id, oracle_id }: P9MagicCard, entryType: P9DecklistEntryType) =>
        service.upsertEntry(oracle_id, _id, entryType),
      [service],
    ),
  ];
}
