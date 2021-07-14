import { P9DecklistEntryType } from './user-decklist';

/**
 * Defines an individual card entry in a decklist
 */

type P9UserDecklistEntryTypeMap = { [key in P9DecklistEntryType]?: number };

export interface P9UserDecklistEntry extends P9UserDecklistEntryTypeMap {
  id: string;
  cardId: string;
}

export const P9UserDecklistEntrySchema: Realm.ObjectSchema = {
  name: 'user_decklist_entry',
  embedded: true,
  properties: {
    id: 'string',
    cardId: 'string',
    maindeck: 'int?',
    sideboard: 'int?',
  },
};
