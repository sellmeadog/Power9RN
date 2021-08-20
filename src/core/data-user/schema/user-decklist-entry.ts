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
  name: 'UserDecklistEntry',
  embedded: true,
  properties: {
    id: 'string',
    cardId: 'string',
    maindeck: 'int?',
    sideboard: 'int?',
  },
};

export interface P9UserDecklistMetadata {
  defaultCardArtworkUri?: string;
  defaultCardId?: string;
  maindeck: number;
  sideboard: number;
  W?: number;
  U?: number;
  B?: number;
  R?: number;
  G?: number;
  C?: number;
  [key: string]: any;
}

export const P9UserDecklistMetadataSchema: Realm.ObjectSchema = {
  name: 'UserDecklistMetadata',
  embedded: true,
  properties: {
    defaultCardArtworkUri: 'string?',
    defaultCardId: 'string?',
    maindeck: 'int',
    sideboard: 'int',
    W: 'int?',
    U: 'int?',
    B: 'int?',
    R: 'int?',
    G: 'int?',
    C: 'int?',
  },
};
