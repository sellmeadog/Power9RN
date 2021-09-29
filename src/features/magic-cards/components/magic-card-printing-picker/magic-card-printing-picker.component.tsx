import React, { FunctionComponent } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { P9MagicCard } from '../../../../core/public';
import { P9MagicCardPrintingPickerSheet } from './magic-card-printing-picker-sheet.component';
import { P9MagicCardPrintingPickerToggle } from './magic-card-printing-picker-toggle.component';

export interface P9MagicCardPrintingPickerProps {
  activeColor?: string;
  inactiveColor?: string;
  onPrintingChange?: (cardId: string) => void;
  printing?: P9MagicCard;
  toggleContainerStyle?: StyleProp<ViewStyle>;
}

export const P9MagicCardPrintingPicker: FunctionComponent<P9MagicCardPrintingPickerProps> = ({
  activeColor,
  inactiveColor,
  toggleContainerStyle,
}) => {
  return (
    <>
      <P9MagicCardPrintingPickerToggle
        activeColor={activeColor}
        containerStyle={[P9MagicCardPrintingPickerTheme.toggleContainer, toggleContainerStyle]}
        inactiveColor={inactiveColor}
      />
      <P9MagicCardPrintingPickerSheet />
    </>
  );
};

const P9MagicCardPrintingPickerTheme = StyleSheet.create({
  toggleContainer: {
    marginBottom: 16,
  },
});
