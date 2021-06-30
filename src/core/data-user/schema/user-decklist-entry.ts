import { P9DecklistEntryType } from './user-decklist';

/**
 * Defines an individual card entry in a decklist
 */

export interface P9UserDecklistEntry {
  id: string;
  cardId: string;
  count: number;
  type: P9DecklistEntryType;
}

export const P9UserDecklistEntrySchema: Realm.ObjectSchema = {
  name: 'user_decklist_entry',
  embedded: true,
  properties: {
    id: 'string',
    cardId: 'string',
    count: 'int',
    type: 'string',
  },
};
