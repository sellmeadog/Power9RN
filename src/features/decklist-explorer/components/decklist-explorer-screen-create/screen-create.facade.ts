import { Reducer, useCallback, useEffect, useReducer } from 'react';

import { P9DocumentInfo } from '../../../../core/data-user';
import { useImportDecklistEntries } from '../../../decklist-import/state/use-decklist-entry-import';
import { P9CreateDecklistInfo, parseTextEntries } from '../../../decklist-parse';

type P9DispatchFn = (type: keyof P9CreateDecklistInfo, value: any) => void;

export type P9CreateDecklistAction = { type: keyof P9CreateDecklistInfo; value: any };
export interface P9CreateDecklistState extends P9CreateDecklistInfo {}

export const createDecklistReducer: Reducer<P9CreateDecklistState, P9CreateDecklistAction> = (state, action) => {
  switch (action.type) {
    case 'manualEntries':
      return {
        ...state,
        [action.type]: action.value,
        parsedEntries: parseTextEntries(action.value),
      };

    default:
      return {
        ...state,
        [action.type]: action.value,
      };
  }
};

export function useCreateDecklistFacade(): [
  state: { decklistInfo: P9CreateDecklistInfo; isValid: boolean },
  dispatch: P9DispatchFn,
  parseDocumentInfo: (documentInfo?: P9DocumentInfo) => void,
] {
  const [decklistInfo, dispatch] = useReducer(createDecklistReducer, { name: '', formatId: 'casual' });
  const [{ importResult }, parseDocumentInfo] = useImportDecklistEntries();

  const dispatchFn: P9DispatchFn = useCallback(
    (type: keyof P9CreateDecklistInfo, value: any) => {
      dispatch({ type, value });
    },
    [dispatch],
  );

  const isValid = () => {
    return !!decklistInfo.name;
  };

  useEffect(() => {
    if (importResult) {
      dispatchFn('manualEntries', importResult.manualEntries);
      dispatchFn('name', importResult.name);
    }
  }, [dispatchFn, importResult]);

  return [{ decklistInfo, isValid: isValid() }, dispatchFn, parseDocumentInfo];
}
