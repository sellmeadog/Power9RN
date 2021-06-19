import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

import { P9MagicCardRarityToggleButtonGroup, P9RowView } from '../../../../components';
import { useMagicCardRarityPredicateBuilderFacade } from './predicate-builder-rarity.facade';

export interface P9MagicCardRarityPredicateBuilderProps {}

export const P9MagicCardRarityPredicateBuilder: FunctionComponent<P9MagicCardRarityPredicateBuilderProps> = () => {
  const [{ selection }, handleToggle] = useMagicCardRarityPredicateBuilderFacade();

  return (
    <P9RowView style={[P9MagicCardRarityPredicateBuilderTheme.container]}>
      <Text>{'Rarity'}</Text>
      <P9MagicCardRarityToggleButtonGroup onToggle={handleToggle} selection={selection} />
    </P9RowView>
  );
};

const P9MagicCardRarityPredicateBuilderTheme = StyleSheet.create({
  container: {
    paddingRight: 10,
  },
});
