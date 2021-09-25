import React, { FunctionComponent, useCallback, useRef } from 'react';
import { StyleSheet } from 'react-native';

import BottomSheet from '@gorhom/bottom-sheet';

import { P9MagicCard } from '../../../../core/public';
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

  return (
    <>
      <P9MagicCardPrintingPickerToggle
        containerStyle={[P9MagicCardPrintingPickerTheme.toggleContainer]}
        onToggle={handleToggle}
        printing={printing}
      />
      <P9MagicCardPrintingPickerSheet
        ref={ref}
        printingOracleId={printing?.oracle_id}
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
