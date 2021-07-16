import { P9DecklistEntryType } from '../../core/data-user';
import { P9UserDecklistEntry } from '../../core/data-user/schema/user-decklist-entry';
import { P9MagicCard } from '../../core/public';

export interface P9DecklistEditorSubEntry {
  id: string;
  count: number;
}

type P9DecklistEditorEntryType = { [key in P9DecklistEntryType]?: P9DecklistEditorSubEntry };

export interface P9DecklistEditorEntry extends P9DecklistEditorEntryType {
  cardId: string;
  id: string;
  magicCard: P9MagicCard | undefined;
}

export interface P9DecklistEditorState {
  activeEntryType?: P9DecklistEntryType;
  name?: string;
  entries?: P9UserDecklistEntry[];
}
