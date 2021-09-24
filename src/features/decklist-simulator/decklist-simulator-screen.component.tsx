import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import { P9ModalHeader } from '../../components';
import { P9DecklistSimulatorMulliganSheet } from './deckist-simulator-mulligan-sheet/decklist-simulator-mulligan-sheet.component';

export interface P9DecklistSimulatorScreenProps {}

export const P9DecklistSimulatorScreen: FunctionComponent<P9DecklistSimulatorScreenProps> = () => {
  return (
    <>
      <P9ModalHeader cancelButtonIcon={'close'} />
      <View style={[P9DecklistSimulatorScreenTheme.container]} />
      <P9DecklistSimulatorMulliganSheet />
    </>
  );
};

const P9DecklistSimulatorScreenTheme = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
