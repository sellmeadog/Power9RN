import { ObjectSchema } from 'realm';

export interface P9MagicSet {
  _id: string;
  code: string;
  tcgplayer_id: number | null;
  name: string;
  set_type: string;
  released_at: string | null;
  block_code: string | null;
  block: string | null;
  parent_set_code: string | null;
  card_count: number;
  printed_size: number;
  digital: boolean;
  icon_svg_uri: string;
}

export const P9MagicSetSchema: ObjectSchema = {
  name: 'MagicSet',
  embedded: true,
  properties: {
    _id: { type: 'string', indexed: true },
    code: { type: 'string', indexed: true },
    tcgplayer_id: 'int?',
    name: 'string',
    set_type: 'string',
    released_at: 'string?',
    block_code: 'string?',
    block: 'string?',
    parent_set_code: 'string?',
    card_count: 'int',
    printed_size: 'int',
    digital: 'bool',
    icon_svg_uri: 'string',
    magic_cards: {
      type: 'linkingObjects',
      objectType: 'MagicCard2',
      property: 'magic_set',
    },
  },
};
