import { Reducer, useCallback, useReducer } from 'react';

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

export function useCreateDecklistState(): [P9DispatchFn, { decklistInfo: P9CreateDecklistInfo; isValid: boolean }] {
  const [decklistInfo, dispatch] = useReducer(createDecklistReducer, { name: '', formatId: 'casual' });

  const dispatchFn: P9DispatchFn = useCallback(
    (type: keyof P9CreateDecklistInfo, value: any) => {
      dispatch({ type, value });
    },
    [dispatch],
  );

  const isValid = () => {
    return !!decklistInfo.name;
  };

  return [dispatchFn, { decklistInfo, isValid: isValid() }];
}
