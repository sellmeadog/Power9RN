import { useObservableState } from 'observable-hooks';
import { useCallback, useEffect } from 'react';
import { singleton } from 'tsyringe';

import { useDependency } from '../../../core/di';
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
}

export function useDecklistEditorFacade(): [
  state: P9DecklistEditorState,
  updateFn: <K extends keyof P9DecklistEditorUIState>(key: K, value: P9DecklistEditorUIState[K]) => void,
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
  ];
}
