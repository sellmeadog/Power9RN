import React, { FunctionComponent, useMemo } from 'react';

import { P9FlatList, P9ItemSeparator } from '../../../components';
import { P9DecklistEntryType } from '../../../core/data-user';
import { P9UserDecklistEntry } from '../../../core/data-user/schema/user-decklist-entry';
import { useDependency } from '../../../core/di';
import { P9MagicCard } from '../../../core/public';
import { P9MagicCardGalleryQuery } from '../../magic-cards/state/magic-card.query';
import { useDecklistEditorFacade } from '../state/decklist-editor.service';
import { P9DecklistEditorEntryExplorerItem } from './decklist-editor-entry-explorer-item.component';

export interface P9DecklistEditorEntryExplorerProps {
  entryType: P9DecklistEntryType;
}

export const P9DecklistEditorEntryExplorer: FunctionComponent<P9DecklistEditorEntryExplorerProps> = ({ entryType }) => {
  const [{ entries = [] }] = useDecklistEditorFacade();
  const editorEntries = useDecklistEditorEntries(entries, entryType);

  return (
    <P9FlatList
      ItemSeparatorComponent={P9ItemSeparator}
      data={editorEntries}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <P9DecklistEditorEntryExplorerItem entry={item} entryType={entryType} />}
    />
  );
};

// const P9DecklistEditorEntryExplorerTheme = StyleSheet.create({});

export interface P9DecklistEditorEntry extends P9UserDecklistEntry {
  magicCard?: P9MagicCard;
}

function useDecklistEditorEntries(
  entries: P9UserDecklistEntry[],
  entryType: P9DecklistEntryType,
): P9DecklistEditorEntry[] {
  const query = useDependency(P9MagicCardGalleryQuery);

  return useMemo(
    () =>
      entries
        .filter((entry) => Boolean(entry[entryType]))
        .map((entry) => ({ ...entry, magicCard: query.magicCard(entry.cardId) }))
        .sort(
          sortComparer,
          // (a, b) =>
          //   ((a.magicCard?.cmc ?? 0) - (b.magicCard?.cmc ?? 0) ||
          //     a.magicCard?.name?.localeCompare(b.magicCard?.name ?? '', 'en', {
          //       ignorePunctuation: true,
          //       sensitivity: 'base',
          //     })) ??
          //   0,
        ),
    [entries, entryType, query],
  );
}

const sortComparer = ({ magicCard: a }: P9DecklistEditorEntry, { magicCard: b }: P9DecklistEditorEntry) => {
  console.log('a', a?.card_faces[0].types, Array.isArray(a?.card_faces[0].types));
  console.log('b', b?.card_faces[0].types);
  // if (a === undefined) {
  //   return -1;
  // } else if (b === undefined) {
  //   return 1;
  // } else if (
  //   (a.card_faces?.[0].types?.includes('Land') ?? false) > (b.card_faces?.[0].types?.includes('Land') ?? false)
  // ) {
  //   return 1;
  // } else if (
  //   (a.card_faces?.[0].types?.includes('Land') ?? false) < (b.card_faces?.[0].types?.includes('Land') ?? false)
  // ) {
  //   return -1;
  // } else {
  return (
    ((a?.cmc ?? 0) - (b?.cmc ?? 0) ||
      a?.name?.localeCompare(b?.name ?? '', 'en', {
        ignorePunctuation: true,
        sensitivity: 'base',
      })) ??
    0
  );
  // }
};
