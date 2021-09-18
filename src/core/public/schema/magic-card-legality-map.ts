import { ObjectSchema } from 'realm';

export type P9MagicCardLegalStatus = 'banned' | 'legal' | 'not_legal' | 'restricted';

export interface P9MagicCardLegalityMap {
  brawl: P9MagicCardLegalStatus;
  commander: P9MagicCardLegalStatus;
  future: P9MagicCardLegalStatus;
  historic: P9MagicCardLegalStatus;
  legacy: P9MagicCardLegalStatus;
  modern: P9MagicCardLegalStatus;
  oathbreaker: P9MagicCardLegalStatus;
  pauper: P9MagicCardLegalStatus;
  pioneer: P9MagicCardLegalStatus;
  standard: P9MagicCardLegalStatus;
  vintage: P9MagicCardLegalStatus;
}

export const P9MagicCardLegalityMapSchema: ObjectSchema = {
  name: 'MagicCardLegalityMap',
  embedded: true,
  properties: {
    brawl: 'string',
    commander: 'string',
    future: 'string',
    historic: 'string',
    legacy: 'string',
    modern: 'string',
    oathbreaker: 'string',
    pauper: 'string',
    pioneer: 'string',
    standard: 'string',
    vintage: 'string',
  },
};
