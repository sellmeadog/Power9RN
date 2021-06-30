import { P9UserDecklistEntry } from './user-decklist-entry';

export type P9DecklistEntryType = 'commander' | 'maindeck' | 'sideboard';

/**
 * Defines an individual card entry in a decklist
 */
export interface P9ImportedDecklistEntry {
  cardName: string;
  collectorNumber?: string;
  count: number;
  expansionCode?: string;
  type: P9DecklistEntryType;
}

export interface P9UserDecklist {
  _id: string;
  _partition: string;
  name: string;
  formatId?: string;
  description?: string;
  entries: P9UserDecklistEntry[];
  isPublic?: boolean;
  createdAt: number;
  modifiedOn: number;
}

export const P9UserDecklistSchema: Realm.ObjectSchema = {
  name: 'user_decklist',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    _partition: 'string',
    name: 'string',
    formatId: 'string?',
    description: 'string?',
    entries: 'user_decklist_entry[]',
    isPublic: 'bool?',
    createdAt: 'int',
    modifiedOn: 'int',
  },
};
