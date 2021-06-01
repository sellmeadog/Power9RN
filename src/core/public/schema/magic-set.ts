import { NullableBoolean, NullableNumber, NullableString } from './nullable-types';

export type P9MagicSet = {
  arena_code: NullableString;
  block: NullableString;
  block_code: NullableString;
  card_count: NullableNumber;
  code: NullableString;
  digital: NullableBoolean;
  foil_only: NullableBoolean;
  icon_svg_uri: NullableString;
  mtgo_code: NullableString;
  name: NullableString;
  nonfoil_only: NullableBoolean;
  parent_set_code: NullableString;
  printed_size: NullableNumber;
  released_at: NullableString;
  set_type: NullableString;
  source_id: NullableString;
  tcgplayer_id: NullableNumber;
};

export const P9MagicSetSchema: Realm.ObjectSchema = {
  name: 'MagicSet',
  embedded: true,
  properties: {
    arena_code: 'string?',
    block: 'string?',
    block_code: 'string?',
    card_count: 'int?',
    code: { type: 'string', indexed: true },
    digital: 'bool?',
    foil_only: 'bool?',
    icon_svg_uri: 'string',
    mtgo_code: 'string?',
    name: 'string',
    nonfoil_only: 'bool?',
    parent_set_code: 'string?',
    printed_size: 'int?',
    released_at: 'string',
    set_type: 'string',
    source_id: 'string',
    tcgplayer_id: 'int?',
  },
};
