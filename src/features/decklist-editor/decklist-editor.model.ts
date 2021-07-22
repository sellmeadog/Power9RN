import { SectionListData } from 'react-native';

import { P9DecklistEntryType } from '../../core/data-user';
import { P9MagicCard } from '../../core/public';

export type P9DecklistEditorEntryType = 'commander' | 'maindeck' | 'sideboard';
export type P9DecklistEditorEntryCountMap = { [key in P9DecklistEditorEntryType]?: number };
export type P9DecklistEditorEntryDataMap = {
  [key in P9DecklistEditorEntryType]?: SectionListData<P9DecklistEditorEntry>[];
};

export interface P9DecklistEditorEntry extends P9DecklistEditorEntryCountMap {
  cardId: string;
  id: string;
  magicCard?: P9MagicCard;
}

export interface P9DecklistEditorState extends P9DecklistEditorEntryDataMap {
  activeEntryType?: P9DecklistEntryType;
  entries?: P9DecklistEditorEntry[];
  name?: string;
}
