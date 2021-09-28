import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BottomSheet from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';

import { P9BottomSheetBackground } from '../../../../components';
import { P9MagicCardObject } from '../../../../core/public';
import { usePower9Theme } from '../../../../core/theme';
import { P9MagicCardPrintingPickerSheetHandle } from './magic-card-printing-picker-sheet-handle.component';

export interface P9MagicCardPrintingPickerSheetProps {
  onSelectedPrintingChange?: (printingId: string) => void;
  printings?: ReadonlyArray<P9MagicCardObject>;
  selectedPrintingId?: string;
}

export const P9MagicCardPrintingPickerSheet = forwardRef<BottomSheet, P9MagicCardPrintingPickerSheetProps>(
  ({ printings, selectedPrintingId, onSelectedPrintingChange }, ref) => {
    const [{ colors }] = usePower9Theme();
    const { bottom } = useSafeAreaInsets();

    return (
      <>
        <BottomSheet
          ref={ref}
          backgroundComponent={(props) => <P9BottomSheetBackground elevation={1} {...props} />}
          enablePanDownToClose={true}
          handleComponent={(props) => (
            <P9MagicCardPrintingPickerSheetHandle {...props} printingsCount={printings?.length} />
          )}
          index={-1}
          snapPoints={[250 + 44 + bottom]}
          style={P9MagicCardPrintingPickerSheetTheme.bottomSheet}
        >
          <Picker
            selectedValue={selectedPrintingId}
            onValueChange={onSelectedPrintingChange}
            itemStyle={P9MagicCardPrintingPickerSheetTheme.item}
          >
            {printings?.map((printing) => (
              <Picker.Item
                color={printing._id === selectedPrintingId ? colors?.primary : colors?.white}
                key={printing._id}
                label={`\t${printing.magic_set.name}, #${printing.collector_number}`}
                value={printing._id}
              />
            ))}
          </Picker>
        </BottomSheet>
      </>
    );
  },
);

const P9MagicCardPrintingPickerSheetTheme = StyleSheet.create({
  bottomSheet: {
    zIndex: 1,
  },

  titleContainer: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },

  item: {
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'left',
    paddingLeft: 10,
  },
});
