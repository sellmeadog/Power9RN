import { Nullable } from './nullable-types';

export interface P9MagicCardImageMap {
  small: Nullable<string>;
  normal: Nullable<string>;
  large: Nullable<string>;
  png: Nullable<string>;
  art_crop: Nullable<string>;
  border_crop: Nullable<string>;
}

export const P9MagicCardImageMapSchema: Realm.ObjectSchema = {
  name: 'MagicCardImageMap',
  embedded: true,
  properties: {
    small: 'string?',
    normal: 'string?',
    large: 'string?',
    png: 'string?',
    art_crop: 'string?',
    border_crop: 'string?',
  },
};
