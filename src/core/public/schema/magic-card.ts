import { ObjectSchema } from 'realm';

import { P9MagicCardFace } from './magic-card-face';
import { P9MagicCardLegalityMap } from './magic-card-legality-map';
import { P9MagicCardPreview } from './magic-card-preview';
import { P9MagicSet } from './magic-set';

export interface P9MagicCard {
  // Core Card Fields
  _id: string;
  _partition: string;
  tcgplayer_id: number | null;
  cardmarket_id: number | null;
  oracle_id: string;
  rulings_uri: string;

  // Gameplay Fields
  card_faces: P9MagicCardFace[];
  cmc: number;
  color_identity: string[];
  edhrec_rank: number | null;
  keywords: string[];
  layout: string;
  legalities: P9MagicCardLegalityMap;
  name: string;
  produced_mana: string[];
  reserved: boolean;

  // Print Fields
  booster: boolean;
  border_color: string;
  collector_number: string;
  default_card: boolean | null;
  digital: boolean;
  finishes: string[];
  flavor_name: string | null;
  frame_effects: string[];
  frame: string;
  full_art: boolean;
  games: string[];
  magic_set: P9MagicSet;
  promo: boolean;
  promo_types: string[];
  rarity: string;
  released_at: string;
  reprint: boolean;
  textless: boolean;
  preview: P9MagicCardPreview | null;
}

export type P9MagicCardObject = P9MagicCard & Realm.Object;

export const P9MagicCardSchema: ObjectSchema = {
  name: 'MagicCard',
  primaryKey: '_id',
  properties: {
    // Core Card Fields
    _id: { type: 'string', indexed: true },
    _partition: { type: 'string', indexed: true },
    tcgplayer_id: 'int?',
    cardmarket_id: 'int?',
    oracle_id: { type: 'string', indexed: true },
    rulings_uri: 'string',

    // Gameplay Fields
    card_faces: 'MagicCardFace[]',
    cmc: 'double',
    color_identity: 'string[]',
    edhrec_rank: 'int?',
    keywords: 'string[]',
    layout: 'string',
    legalities: 'MagicCardLegalityMap',
    name: 'string',
    produced_mana: 'string[]',
    reserved: 'bool',

    // Print Fields
    booster: 'bool',
    border_color: 'string',
    collector_number: 'string',
    default_card: { type: 'bool', indexed: true },
    digital: 'bool',
    finishes: 'string[]',
    flavor_name: 'string?',
    frame_effects: 'string[]',
    frame: 'string',
    full_art: 'bool',
    games: 'string[]',
    magic_set: 'MagicSet',
    promo: 'bool',
    promo_types: 'string[]',
    rarity: { type: 'string', indexed: true },
    released_at: { type: 'string', indexed: true },
    reprint: 'bool',
    textless: 'bool',
    preview: 'MagicCardPreview?',
  },
};
