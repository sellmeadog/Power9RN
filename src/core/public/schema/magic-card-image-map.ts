import { ObjectSchema } from 'realm';

export interface P9MagicCardImageUriMap {
  png: string | null;
  border_crop: string | null;
  art_crop: string | null;
  large: string | null;
  normal: string | null;
  small: string | null;
}

export const P9MagicCardImageUriMapSchema: ObjectSchema = {
  name: 'MagicCardImageUriMap',
  embedded: true,
  properties: {
    png: 'string?',
    border_crop: 'string?',
    art_crop: 'string?',
    large: 'string?',
    normal: 'string?',
    small: 'string?',
  },
};
