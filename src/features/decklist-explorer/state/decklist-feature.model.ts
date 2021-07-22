import { P9DecklistEntryType } from '../../../core/data-user';

export interface P9DecklistEditorUIState {
  activeEntryType: P9DecklistEntryType;
  activeEntryId?: string;
}
