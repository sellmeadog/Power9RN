import { ID } from '@datorama/akita';

import { P9DecklistEntryType } from '../../../core/data-user';
import { P9MagicCardFace } from '../../../core/public';

export type P9DecklistEditorEntryType = 'commander' | 'maindeck' | 'sideboard';
export type P9DecklistEditorEntryTypeMap = { [key in P9DecklistEditorEntryType]: number };

export interface P9DecklistEditorEntry extends P9DecklistEditorEntryTypeMap {
  id: ID;
  magicCard?: P9MagicCardFace;
}

export interface P9DecklistEditorUIState {
  activeEntryType: P9DecklistEntryType;
}
