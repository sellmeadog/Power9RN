import React, { FunctionComponent, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';

import { BottomSheetHandle, BottomSheetHandleProps, useBottomSheet } from '@gorhom/bottom-sheet';

import { P9TitleText } from '../../../../components';

export interface P9MagicCardPrintingPickerSheetHandleProps extends BottomSheetHandleProps {
  printingsCount?: number;
}

export const P9MagicCardPrintingPickerSheetHandle: FunctionComponent<P9MagicCardPrintingPickerSheetHandleProps> = ({
  printingsCount,
  ...rest
}) => {
  const { close } = useBottomSheet();
  const handlePress = useCallback(() => close(), [close]);

  return (
    <BottomSheetHandle {...rest}>
      <View style={[P9MagicCardPrintingPickerSheetHandleTheme.titleContainer]}>
        <P9TitleText>
          {(printingsCount ?? 1) > 1 ? `${printingsCount} Additional Printings` : '1 Printing Available'}{' '}
        </P9TitleText>
        <Button
          onPress={handlePress}
          title={'Done'}
          titleStyle={[P9MagicCardPrintingPickerSheetHandleTheme.button]}
          type={'clear'}
        />
      </View>
    </BottomSheetHandle>
  );
};

const P9MagicCardPrintingPickerSheetHandleTheme = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },

  button: {
    fontSize: 17,
  },
});
