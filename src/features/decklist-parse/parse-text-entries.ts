import { P9DecklistEntryType } from '../../core/data-user';
import { P9CreateDecklistEntryInfo } from './parse-document-types';

const REGEX_EMPTY_LINE = /^[\r|\n]*?$/im;
const REGEX_SIDEBOARD_LINE = /^(?:.*?Sideboard.*?)?$/im;
const REGEX_DECKLIST_ENTRY_LINE = /^((?:SB:\s*?)?\d+)\s*(.*(?=\s\(\w*?\))|.*)(?:\s\((\w*)\)\s?(\w*)?)?$/gim;

export function parseEntryInfo(type: P9DecklistEntryType, textEntries: string): P9CreateDecklistEntryInfo[] {
  const entries: P9CreateDecklistEntryInfo[] = [];
  let match: RegExpExecArray | null;

  while ((match = REGEX_DECKLIST_ENTRY_LINE.exec(textEntries))) {
    const [_, count, cardName, expansionCode, collectorNumber] = match;

    entries.push({
      type,
      count,
      cardName,
      expansionCode,
      collectorNumber,
    });
  }

  return entries;
}

export const parseTextEntries = (documentContent: string) => {
  const [maindeck, sideboard] = documentContent
    .trim()
    .split(REGEX_SIDEBOARD_LINE)
    .filter((s) => !s.match(REGEX_EMPTY_LINE));

  const maindeckEntryInfo = parseEntryInfo('maindeck', maindeck);
  const sideboardEntryInfo = parseEntryInfo('sideboard', sideboard);

  return [...maindeckEntryInfo, ...sideboardEntryInfo];
};
