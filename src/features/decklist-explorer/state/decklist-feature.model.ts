import { P9DecklistEntryType } from '../../../core/data-user';

export type P9GameFormatType =
  | 'casual'
  | 'standard'
  | 'historic'
  | 'pioneer'
  | 'modern'
  | 'legacy'
  | 'pauper'
  | 'vintage'
  | 'brawl'
  | 'commander'
  | 'oathbreaker';

export const P9_GAME_FORMATS: { id: P9GameFormatType; name: string }[] = [
  { id: 'casual', name: 'Casual' },
  { id: 'standard', name: 'Standard' },
  { id: 'historic', name: 'Historic' },
  { id: 'pioneer', name: 'Pioneer' },
  { id: 'modern', name: 'Modern' },
  { id: 'legacy', name: 'Legacy' },
  { id: 'pauper', name: 'Pauper' },
  { id: 'vintage', name: 'Vintage' },
  { id: 'brawl', name: 'Brawl' },
  { id: 'commander', name: 'Commander' },
  { id: 'oathbreaker', name: 'Oathbreaker' },
];

export interface P9DecklistEditorUIState {
  activeEntryType: P9DecklistEntryType;
  activeEntryId?: string;
}
