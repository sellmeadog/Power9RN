import React, { FunctionComponent } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

import { P9BottomSheetBackground, P9TitleText } from '../../../components';

export interface P9DecklistSimulatorMulliganSheetProps {}

export const P9DecklistSimulatorMulliganSheet: FunctionComponent<P9DecklistSimulatorMulliganSheetProps> = () => {
  const { bottom } = useSafeAreaInsets();

  return (
    <>
      <BottomSheet
        backdropComponent={BottomSheetBackdrop}
        backgroundComponent={P9BottomSheetBackground}
        enablePanDownToClose={true}
        index={1}
        snapPoints={[bottom, 300]}
      >
        <P9TitleText>{'Opening Hand'}</P9TitleText>
      </BottomSheet>
    </>
  );
};
