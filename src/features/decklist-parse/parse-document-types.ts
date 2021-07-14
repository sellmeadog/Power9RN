import { P9DecklistEntryType } from '../../core/data-user';

export interface P9CreateDecklistInfo {
  name: string;
  formatId: string;
  manualEntries?: string;
  parsedEntries?: P9CreateDecklistEntryInfo[];
  description: string | null;
}

export interface P9CreateDecklistEntryInfo {
  type: P9DecklistEntryType;
  count: string;
  cardName: string;
  expansionCode?: string;
  collectorNumber?: string;
}

export interface P9DocumentParseResult {
  manualEntries: string;
  parsedEntries: P9CreateDecklistEntryInfo[];
}
