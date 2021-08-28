import { SectionListData } from 'react-native';

import { P9DecklistEntryType } from '../../core/data-user';
import { P9MagicCard } from '../../core/public';

export type P9DecklistEditorEntryCountMap = { [key in P9DecklistEntryType]?: number };
export type P9DecklistEditorEntryDataMap = {
  [key in P9DecklistEntryType]?: SectionListData<P9DecklistEditorEntry>[];
};

export interface P9DecklistEditorEntry extends P9DecklistEditorEntryCountMap {
  cardId: string;
  id: string;
  magicCard?: P9MagicCard;
}

export interface P9DecklistEditorState extends P9DecklistEditorEntryDataMap {
  activeEntryType?: P9DecklistEntryType;
  entries?: P9DecklistEditorEntry[];
  entryCounts?: { maindeck?: number; sideboard?: number };
  name?: string;
}
