import Papa from 'papaparse';

import { P9CreateDecklistEntryInfo, P9DocumentParseResult } from './parse-document-types';

const KNOWN_COUNT_HEADERS = ['quantity', 'amount', 'count', 'total qty', 'qty', 'regular'];
const KNOWN_NAME_HEADERS = ['card', 'card name', 'name', 'card_name'];
const KNOWN_EXPANSION_CODE_HEADERS = ['set', 'edition', 'expansion symbol', 'set id', 'set code', 'set_code', 'code'];
const KNOWN_COLLECTOR_NUMBER_HEADERS = ['collector #', 'card number'];

/**
 * Alias for each row in the parsed CSV file
 */
type P9CSVDataRow = Partial<P9CreateDecklistEntryInfo>;

/**
 * Adds additional typing to the default Papa.ParseResult interface
 */
interface P9CSVParseResult extends Papa.ParseResult<P9CSVDataRow> {}

/**
 * Initiates the parsing of a CSV document content string and returns a P9DocumentParseResult when complete
 * @param csvString The document content read from a parent CSV file
 */
export const parseDocumentCsv = (csvString: string): P9DocumentParseResult => {
  const parseResult = parseCSVString(csvString);
  const [manualEntries, parsedEntries] = reduceDataRows(parseResult);

  return {
    manualEntries: manualEntries.join('\n'),
    parsedEntries,
  };
};

/**
 * Reduces a single P9CSVDataRow into a string and P9CreateDecklistEntryInfo representation if possible
 * @param param0 The destructured aggregate value from the parent reduce function
 * @param param1 The next P9CSVDataRow to reduce
 */
const reduceDataRow = (
  [manual, parsed]: [string[], P9CreateDecklistEntryInfo[]],
  { count, cardName, expansionCode, collectorNumber }: P9CSVDataRow,
): [string[], P9CreateDecklistEntryInfo[]] => {
  if (!count || !cardName || /^\W*?$/gim.test(cardName)) {
    return [manual, parsed];
  }

  count = count.trim();
  cardName = cardName.trim();

  const builder = [count, cardName];
  const entry: P9CreateDecklistEntryInfo = { type: 'maindeck', count, cardName };

  if (expansionCode) {
    expansionCode = expansionCode.trim();
    builder.push(`(${expansionCode})`);
    entry.expansionCode = expansionCode;
  }

  if (collectorNumber) {
    if (collectorNumber.indexOf('/') > -1) {
      collectorNumber = collectorNumber.slice(0, collectorNumber.indexOf('/'));
    }
    collectorNumber = collectorNumber.trim();
    builder.push(collectorNumber);
    entry.collectorNumber = collectorNumber;
  }

  return [manual.concat([builder.join(' ')]), parsed.concat([entry])];
};

/**
 * Reduces the raw Papa.ParseResult
 * @param result The enhanced Papa.ParseResult to be reduced
 */
const reduceDataRows = (result: P9CSVParseResult): [string[], P9CreateDecklistEntryInfo[]] => {
  const manualEntries: string[] = [];
  const parsedEntries: P9CreateDecklistEntryInfo[] = [];

  return result.data.reduce(reduceDataRow, [manualEntries, parsedEntries] as [string[], P9CreateDecklistEntryInfo[]]);
};

/**
 * Parses the given CSV data string into an array of P9CSVDataRow objects
 * @param csvString The CSV string to parse
 */
const parseCSVString = (csvString: string): P9CSVParseResult => {
  return Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => {
      header = header.toLowerCase();
      if (KNOWN_COUNT_HEADERS.includes(header)) {
        return 'count';
      }
      if (KNOWN_NAME_HEADERS.includes(header)) {
        return 'cardName';
      }
      if (KNOWN_EXPANSION_CODE_HEADERS.includes(header)) {
        return 'expansionCode';
      }
      if (KNOWN_COLLECTOR_NUMBER_HEADERS.includes(header)) {
        return 'collectorNumber';
      }
      return `UNUSED_${header}`;
    },
  });
};
