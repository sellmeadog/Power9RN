import { useObservableCallback, useObservableState } from 'observable-hooks';
import { EMPTY, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { P9DocumentInfo } from '../../../core/data-user';
import { P9CreateDecklistInfo, parseDocument } from '../../decklist-parse';

type P9ImportDecklistEntriesResult = {
  importResult?: Pick<P9CreateDecklistInfo, 'name' | 'manualEntries' | 'parsedEntries'>;
  hasError: boolean;
  error?: any;
};

export function useImportDecklistEntries(): [
  result: P9ImportDecklistEntriesResult,
  handler: (documentInfo: P9DocumentInfo | undefined) => void,
] {
  const [parseDocumentInfo, result$] = useObservableCallback<P9ImportDecklistEntriesResult, P9DocumentInfo | undefined>(
    (info$) =>
      info$.pipe(
        switchMap((info) => (info ? parseDocument(info) : EMPTY)),
        map((importResult) => ({ importResult, hasError: false })),
        catchError((reason) => of({ error: reason, hasError: true })),
      ),
  );

  return [useObservableState(result$, { hasError: false }), parseDocumentInfo];
}
