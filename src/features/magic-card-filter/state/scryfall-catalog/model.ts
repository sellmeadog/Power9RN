export type P9ScryfallCatalogType =
  | 'ability-words'
  | 'artifact-types'
  | 'artist-names'
  | 'card-names'
  | 'creature-types'
  | 'enchantment-types'
  | 'keyword-abilities'
  | 'keyword-actions'
  | 'land-types'
  | 'loyalties'
  | 'planeswalker-types'
  | 'powers'
  | 'spell-types'
  | 'toughnesses'
  | 'watermarks'
  | 'word-bank'
  | string;

export interface P9ScryfallCatalog {
  id: P9ScryfallCatalogType;
  title: string;
  data: string[];
}
