import { NullableString } from './nullable-types';

export type P9MagicCardPart = {
  card_id: NullableString;
  component: NullableString;
  name: NullableString;
  type_line: NullableString;
};

export const P9MagicCardPartSchema: Realm.ObjectSchema = {
  name: 'MagicCardPart',
  embedded: true,
  properties: {
    card_id: 'string',
    component: 'string',
    name: 'string',
    type_line: 'string',
  },
};
