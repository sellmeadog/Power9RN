import { produce } from 'immer';
import { useObservable, useObservableState } from 'observable-hooks';
import { combineLatest } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { useDependency } from '../../../core/di';
import { P9DecklistEditorQuery } from '../state/decklist-editor.query';

type P9DecklistSymbolCountMap = { [key in string]?: number };

export interface P9DecklistMetadata {
  gameSymbolCounts: P9DecklistSymbolCountMap;
}

export function useDecklistMetadataFacade(): P9DecklistMetadata {
  const query = useDependency(P9DecklistEditorQuery);

  const gameSymbolCounts$ = useObservable(() =>
    combineLatest({
      gameSymbolCounts: query.entries$.pipe(
        map((entries = []) =>
          entries.reduce((counts, { magicCard }) => incrementColorCounts(counts, magicCard?.color_identity), {}),
        ),
        distinctUntilChanged(),
      ),
    }),
  );

  return useObservableState(gameSymbolCounts$, { gameSymbolCounts: {} } as P9DecklistMetadata);
}

function incrementColorCounts(colorCounts: P9DecklistSymbolCountMap, symbols: string[] = ['C']) {
  return produce((draft) => {
    symbols.forEach((symbol) => {
      draft[symbol] = (draft[symbol] ?? 0) + 1;
    });
  }, colorCounts);
}
