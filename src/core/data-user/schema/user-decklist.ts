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
  name: 'UserDecklist',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    _partition: 'string',
    createdAt: 'int',
    description: 'string?',
    entries: 'UserDecklistEntry[]',
    formatId: 'string?',
    isPublic: 'bool?',
    metadata: 'UserDecklistMetadata',
    modifiedOn: 'int',
    name: 'string',
  },
};
