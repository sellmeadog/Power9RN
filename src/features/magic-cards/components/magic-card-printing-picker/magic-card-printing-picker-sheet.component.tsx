import { pluckFirst, useObservable, useObservableState } from 'observable-hooks';
import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import BottomSheet from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';

import { P9BottomSheetBackground } from '../../../../components';
import { useDependency } from '../../../../core/di';
import { P9PublicPartitionQuery } from '../../../../core/public/state/public-partition.query';
import { usePower9Theme } from '../../../../core/theme';

export interface P9MagicCardPrintingPickerSheetProps {
  animatedIndex?: Animated.SharedValue<number>;
  onSelectedPrintingChange?: (printingId: string) => void;
  printingOracleId?: string;
  selectedPrintingId?: string;
}

export const P9MagicCardPrintingPickerSheet = forwardRef<BottomSheet, P9MagicCardPrintingPickerSheetProps>(
  ({ animatedIndex, printingOracleId, selectedPrintingId, onSelectedPrintingChange }, ref) => {
    const [{ colors }] = usePower9Theme();
    const query = useDependency(P9PublicPartitionQuery);
    const printings = useObservableState(
      useObservable(
        (oracleId$) =>
          combineLatest([oracleId$.pipe(pluckFirst, filter(Boolean)), query.magicCards$]).pipe(
            map(([oracleId, magicCards]) =>
              magicCards?.filtered('oracle_id == $0', oracleId).sorted([
                ['released_at', true],
                ['collector_number', true],
                ['promo', false],
              ]),
            ),
          ),
        [printingOracleId],
      ),
    );

    return (
      <>
        <BottomSheet
          animatedIndex={animatedIndex}
          backgroundComponent={P9BottomSheetBackground}
          index={-1}
          ref={ref}
          snapPoints={[0, 216]}
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

  item: {
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'left',
    paddingLeft: 10,
  },
});
