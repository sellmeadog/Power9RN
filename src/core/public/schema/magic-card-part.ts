import { ObjectSchema } from 'realm';

export type P9MagicCardRelatedPart = {
  card_id: string | null;
  component: string | null;
  name: string | null;
  type_line: string | null;
};

export const P9MagicCardRelatedPart: ObjectSchema = {
  name: 'MagicCardRelatedPart',
  embedded: true,
  properties: {
    card_id: 'string?',
    component: 'string?',
    name: 'string?',
    type_line: 'string?',
  },
};
