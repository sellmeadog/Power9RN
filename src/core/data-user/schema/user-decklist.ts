import { P9UserDecklistEntry, P9UserDecklistMetadata } from './user-decklist-entry';

export type P9DecklistEntryType = 'maindeck' | 'sideboard'; // 'commander' |

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
  metadata: P9UserDecklistMetadata;
}

export const P9UserDecklistSchema: Realm.ObjectSchema = {
  name: 'user_decklist_2',
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
    metadata: 'user_decklist_metadata',
  },
};
