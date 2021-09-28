import { pluckFirst, useObservable, useObservableState } from 'observable-hooks';
import React, { FunctionComponent, useCallback, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { filter, switchMap } from 'rxjs/operators';

import BottomSheet from '@gorhom/bottom-sheet';

import { useDependency } from '../../../../core/di';
import { P9MagicCard } from '../../../../core/public';
import { P9PublicPartitionQuery } from '../../../../core/public/state/public-partition.query';
import { P9MagicCardPrintingPickerSheet } from './magic-card-printing-picker-sheet.component';
import { P9MagicCardPrintingPickerToggle } from './magic-card-printing-picker-toggle.component';

export interface P9MagicCardPrintingPickerProps {
  printing?: P9MagicCard;
  onPrintingChange?: (cardId: string) => void;
}

export const P9MagicCardPrintingPicker: FunctionComponent<P9MagicCardPrintingPickerProps> = ({
  printing,
  onPrintingChange,
}) => {
  const ref = useRef<BottomSheet>(null);
  const handleToggle = useCallback(() => {
    ref.current?.expand();
  }, []);

  const query = useDependency(P9PublicPartitionQuery);
  const printings = useObservableState(
    useObservable(
      (oracleId$) =>
        oracleId$.pipe(
          pluckFirst,
          filter(Boolean),
          switchMap((oracleId) => query.findMagicCardPrintings(oracleId)),
        ),
      [printing?.oracle_id],
    ),
  );

  return (
    <>
      <P9MagicCardPrintingPickerToggle
        containerStyle={[P9MagicCardPrintingPickerTheme.toggleContainer]}
        onToggle={handleToggle}
        printing={printing}
        printingCount={printings?.length}
      />
      <P9MagicCardPrintingPickerSheet
        ref={ref}
        printings={printings}
        selectedPrintingId={printing?._id}
        onSelectedPrintingChange={onPrintingChange}
      />
    </>
  );
};

const P9MagicCardPrintingPickerTheme = StyleSheet.create({
  toggleContainer: {
    marginBottom: 16,
  },
});
