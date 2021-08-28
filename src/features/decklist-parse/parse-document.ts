import { P9DocumentInfo } from '../../core/data-user';
import { parseDocumentCsv } from './parse-document-csv';
import { P9CreateDecklistInfo } from './parse-document-types';
import { parseTextEntries } from './parse-text-entries';

export type P9CreateDecklistParseDocumentResult = Pick<
  P9CreateDecklistInfo,
  'name' | 'manualEntries' | 'parsedEntries'
>;

/**
 * Parses the given document and returns a P9CreateDecklistParseDocumentResult
 * @param param0 The P9DocumentInfo object to parse
 */
export const parseDocument = async ({
  name: documentName,
  content,
}: P9DocumentInfo): Promise<P9CreateDecklistParseDocumentResult> => {
  const name = documentName.slice(0, documentName.lastIndexOf('.')).trim();
  const documentContent = await content;

  if (documentName.endsWith('.csv')) {
    return { name, ...parseDocumentCsv(documentContent) };
  } else if (documentName.endsWith('.dec')) {
    // TODO: Parse DEC
    return { name };
  } else {
    return {
      name,
      manualEntries: documentContent,
      parsedEntries: parseTextEntries(documentContent),
    };
  }
};
