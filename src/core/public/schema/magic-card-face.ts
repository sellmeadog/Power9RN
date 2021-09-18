import { ObjectSchema } from 'realm';

import { P9MagicCardImageUriMap } from './magic-card-image-map';

export interface P9MagicCardFace {
  artist: string | null;
  color_indicator: string[];
  colors: string[];
  flavor_text: string | null;
  image_uris: P9MagicCardImageUriMap | null;
  loyalty_numeric: number | null;
  loyalty: string | null;
  mana_cost: string;
  name: string;
  names: string[];
  oracle_text: string | null;
  power_numeric: number | null;
  power: string | null;
  printed_name: string | null;
  printed_text: string | null;
  printed_type_line: string | null;
  toughness_numeric: number | null;
  toughness: string | null;
  type_line: string;
  types: string[];
  watermark: string | null;
}

export const P9MagicCardFaceSchema: ObjectSchema = {
  name: 'MagicCardFace',
  embedded: true,
  properties: {
    artist: 'string?',
    color_indicator: 'string[]',
    colors: 'string[]',
    flavor_text: 'string?',
    image_uris: 'MagicCardImageUriMap?',
    loyalty_numeric: { type: 'int?', indexed: true },
    loyalty: 'string?',
    mana_cost: 'string',
    name: 'string',
    names: 'string[]',
    oracle_text: 'string?',
    power_numeric: { type: 'int?', indexed: true },
    power: 'string?',
    printed_name: 'string?',
    printed_text: 'string?',
    printed_type_line: 'string?',
    toughness_numeric: { type: 'int?', indexed: true },
    toughness: 'string?',
    type_line: 'string',
    types: 'string[]',
    watermark: 'string?',
  },
};
