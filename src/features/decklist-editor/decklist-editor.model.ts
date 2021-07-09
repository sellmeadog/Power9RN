import { P9DecklistEntryType } from '../../core/data-user';
import { P9MagicCardFace } from '../../core/public';

export interface P9DecklistEditorSubEntry {
  id: string;
  count: number;
}

type P9DecklistEditorEntryType = { [key in P9DecklistEntryType]?: P9DecklistEditorSubEntry };

export interface P9DecklistEditorEntry extends P9DecklistEditorEntryType {
  id: string;
  magicCard: P9MagicCardFace | undefined;
}

export interface P9DecklistEditorState {
  activeEntryType?: P9DecklistEntryType;
  name?: string;
}
