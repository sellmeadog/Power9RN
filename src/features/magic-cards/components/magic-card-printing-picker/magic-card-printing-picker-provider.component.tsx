import { pluckFirst, useObservable, useObservableState } from 'observable-hooks';
import React, { createContext, FunctionComponent, useCallback, useContext, useRef } from 'react';
import { merge } from 'rxjs';
import { distinctUntilChanged, distinctUntilKeyChanged, filter, map, switchMap, tap } from 'rxjs/operators';

import BottomSheet from '@gorhom/bottom-sheet';

import { useDependency } from '../../../../core/di';
import { whenDefined } from '../../../../core/operators';
import { P9MagicCard } from '../../../../core/public';
import { P9PublicPartitionQuery } from '../../../../core/public/state/public-partition.query';

export type P9MagicCardPrintingPickerContextValue = {
  printing?: P9MagicCard;
  printings: ReadonlyArray<P9MagicCard>;
  ref: React.RefObject<BottomSheet>;
  setPrinting: (id: string) => void;
};

const P9MagicCardPrintingPickerContext = createContext<P9MagicCardPrintingPickerContextValue | undefined>(undefined);

export interface P9MagicCardPrintingPickerProviderProps {
  magicCard?: P9MagicCard;
  onPrintingChange?: (printing: P9MagicCard) => void;
}

export const P9MagicCardPrintingPickerProvider: FunctionComponent<P9MagicCardPrintingPickerProviderProps> = ({
  children,
  magicCard,
  onPrintingChange,
}) => {
  const ref = useRef<BottomSheet>(null);
  const query = useDependency(P9PublicPartitionQuery);

  const magicCard$ = useObservable(
    (input$) =>
      input$.pipe(
        map(([input]) => input),
        whenDefined(),
      ),
    [magicCard],
  );

  const [printing, setPrinting] = useObservableState<P9MagicCard | undefined, string>(
    (id$) =>
      merge(magicCard$, id$.pipe(map((id) => query.findMagicCard(id) as P9MagicCard))).pipe(
        distinctUntilKeyChanged('_id'),
        tap((value) => onPrintingChange?.(value)),
      ),
    magicCard,
  );

  const printings = useObservableState(
    useObservable(
      (oracleId$) =>
        oracleId$.pipe(
          pluckFirst,
          filter(Boolean),
          distinctUntilChanged(),
          switchMap((oracleId) =>
            query
              .findMagicCardPrintings(oracleId)
              .pipe(map((results) => results?.snapshot() as ReadonlyArray<P9MagicCard>)),
          ),
        ),
      [magicCard?.oracle_id],
    ),
    magicCard ? [magicCard] : [],
  );

  return (
    <P9MagicCardPrintingPickerContext.Provider value={{ printing, printings, ref, setPrinting }}>
      {children}
    </P9MagicCardPrintingPickerContext.Provider>
  );
};

export function useMagicCardPrinting() {
  const context = useContext(P9MagicCardPrintingPickerContext);

  if (context === undefined) {
    throw new Error('useMagicCardPrintingPicker must be called within a P9MagicCardPrintingPickerProvider');
  }

  return context.printing;
}

export function useMagicCardPrintingPickerSheet(): [
  state: { printing?: P9MagicCard; printings: ReadonlyArray<P9MagicCard>; ref: React.RefObject<BottomSheet> },
  setPrinting: (id: string) => void,
  close: () => void,
] {
  const context = useContext(P9MagicCardPrintingPickerContext);

  if (context === undefined) {
    throw new Error('useMagicCardPrintingPicker must be called within a P9MagicCardPrintingPickerProvider');
  }

  const { printing, printings, ref, setPrinting } = context;

  return [{ printing, printings, ref }, setPrinting, useCallback(() => ref.current?.close(), [ref])];
}

export function useMagicCardPrintingPickerToggle(): [
  state: { printing?: P9MagicCard; printings: ReadonlyArray<P9MagicCard> },
  expand: () => void,
] {
  const context = useContext(P9MagicCardPrintingPickerContext);

  if (context === undefined) {
    throw new Error('useMagicCardPrintingPicker must be called within a P9MagicCardPrintingPickerProvider');
  }

  const { printing, printings, ref } = context;

  return [{ printing, printings }, useCallback(() => ref.current?.expand(), [ref])];
}
