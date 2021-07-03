import { useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';

import { P9DocumentInfo } from '../../../core/data-user';
import { useCreateDecklist } from './use-decklist-create';
import { useImportDecklistEntries } from './use-decklist-entry-import';

type P9DecklistImportResult = {
  decklistId?: string;
  error?: any;
  hasError: boolean;
  inProgress: boolean;
  progress?: [number, number];
};

export function useImportDecklist(): [
  result: P9DecklistImportResult,
  parseDocumentInfo: (documentInfo: P9DocumentInfo | undefined) => void,
] {
  const [result, parseDocumentInfo] = useImportDecklistEntries();
  const [createDecklist, { decklist, writing, ...rest }] = useCreateDecklist();
  const { navigate } = useNavigation();

  useEffect(() => {
    if (!result.hasError && result.importResult) {
      createDecklist({ formatId: 'standard', ...result.importResult });
    }
  }, [createDecklist, result]);

  useEffect(() => {
    if (!writing && decklist !== undefined) {
      navigate('DecklistManagement.Editor', { decklistId: decklist._id });
    }
  }, [decklist, navigate, writing]);

  return [{ ...rest, decklistId: decklist?._id, inProgress: writing }, parseDocumentInfo];
}
