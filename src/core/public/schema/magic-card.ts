import { P9MagicCardFace } from './magic-card-face';
import { P9MagicCardPart } from './magic-card-part';
import { P9MagicCardPreview } from './magic-card-preview';
import { P9MagicSet } from './magic-set';
import { Nullable, NullableArray, NullableBoolean, NullableNumber, NullableString } from './nullable-types';

export interface P9MagicCard {
  _id: string;
  _owner: string;
  _partition: string;
  arena_id: NullableNumber;
  booster: NullableBoolean;
  border_color: NullableString;
  card_faces: Array<P9MagicCardFace>;
  cardmarket_id: NullableNumber;
  cmc: NullableNumber;
  collector_number: NullableString;
  color_identity: NullableArray<string>;
  digital: NullableBoolean;
  edhrec_rank: NullableNumber;
  foil: NullableBoolean;
  frame_effects: NullableArray<string>;
  frame: NullableString;
  full_art: NullableBoolean;
  games: NullableArray<string>;
  keywords: NullableArray<string>;
  lang: Nullable<string>;
  layout: NullableString;
  legalities: NullableArray<string>;
  magic_set: P9MagicSet;
  name: NullableString;
  name_simple: NullableString;
  nonfoil: NullableBoolean;
  oracle_id: string;
  oversized: NullableBoolean;
  preview: P9MagicCardPreview;
  produced_mana: NullableArray<string>;
  promo_types: NullableArray<string>;
  promo: NullableBoolean;
  rarity: NullableString;
  related_cards: NullableArray<P9MagicCardPart>;
  released_at: NullableString;
  reprint: NullableBoolean;
  reserved: NullableBoolean;
  rulings_uri: NullableString;
  tcgplayer_id: NullableNumber;
  textless: NullableBoolean;
}

export const P9MagicCardSchema: Realm.ObjectSchema = {
  name: 'MagicCard',
  properties: {
    _id: 'string',
    _owner: 'string',
    _partition: 'string',
    arena_id: 'int?',
    booster: 'bool?',
    border_color: 'string?',
    card_faces: 'MagicCardFace[]',
    cardmarket_id: 'int?',
    cmc: { type: 'double', default: 0 },
    collector_number: 'string?',
    color_identity: 'string[]',
    digital: 'bool?',
    edhrec_rank: 'int?',
    foil: 'bool?',
    frame_effects: 'string[]',
    frame: 'string?',
    full_art: 'bool?',
    games: 'string[]',
    keywords: 'string[]',
    lang: 'string?',
    layout: 'string?',
    legalities: 'string[]',
    magic_set: 'MagicSet?',
    name: { type: 'string', indexed: true },
    name_simple: { type: 'string', optional: true },
    nonfoil: 'bool?',
    oracle_id: 'string?',
    oversized: 'bool?',
    preview: 'MagicCardPreview?',
    produced_mana: 'string[]',
    promo_types: 'string[]',
    promo: 'bool?',
    rarity: 'string?',
    related_cards: 'MagicCardPart[]',
    released_at: { type: 'string', indexed: true },
    reprint: 'bool?',
    reserved: 'bool?',
    rulings_uri: 'string?',
    tcgplayer_id: 'int?',
    textless: 'bool?',
  },
  primaryKey: '_id',
};
