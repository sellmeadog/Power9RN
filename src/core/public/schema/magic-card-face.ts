import { P9MagicCardImageMap } from './magic-card-image-map';
import { Nullable } from './nullable-types';

export type P9MagicCardFace = {
  artist: Nullable<string>;
  color_indicator: Nullable<string[]>;
  colors: Nullable<string[]>;
  flavor_text: Nullable<string>;
  image_uris: Nullable<P9MagicCardImageMap>;
  loyalty_numeric: Nullable<number>;
  loyalty: Nullable<string>;
  mana_cost: Nullable<string>;
  name_simple: Nullable<string>;
  name: Nullable<string>;
  names: Nullable<string[]>;
  oracle_text: Nullable<string>;
  power_numeric: Nullable<number>;
  power: Nullable<string>;
  printed_name: Nullable<string>;
  printed_text: Nullable<string>;
  printed_type_line: Nullable<string>;
  printed_types: Nullable<string[]>;
  toughness_numeric: Nullable<number>;
  toughness: Nullable<string>;
  type_line: Nullable<string>;
  types: string[];
  watermark: Nullable<string>;
};

export const P9MagicCardFaceSchema: Realm.ObjectSchema = {
  name: 'MagicCardFace',
  embedded: true,
  properties: {
    artist: 'string?',
    card: { type: 'linkingObjects', objectType: 'MagicCard', property: 'card_faces' },
    color_indicator: 'string[]',
    colors: { type: 'string[]' },
    flavor_text: 'string?',
    image_uris: 'MagicCardImageMap?',
    loyalty_numeric: 'double?',
    loyalty: 'string?',
    mana_cost: 'string?',
    name_simple: { type: 'string', optional: true },
    name: 'string',
    names: 'string[]',
    oracle_text: 'string?',
    power_numeric: 'double?',
    power: 'string?',
    printed_name: 'string?',
    printed_text: 'string?',
    printed_type_line: 'string?',
    printed_types: 'string[]',
    toughness_numeric: 'double?',
    toughness: 'string?',
    type_line: 'string',
    types: 'string[]',
    watermark: 'string?',
  },
};
