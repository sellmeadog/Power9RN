import { NullableString } from './nullable-types';

export interface P9MagicCardPreview {
  date: NullableString;
  source_uri: NullableString;
  source: NullableString;
}

export const P9MagicCardPreviewSchema: Realm.ObjectSchema = {
  name: 'MagicCardPreview',
  embedded: true,
  properties: {
    date: 'string',
    source_uri: 'string?',
    source: 'string?',
  },
};
