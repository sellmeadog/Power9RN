import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { v1 } from 'uuid';

import { P9MagicCardRarity, P9MagicCardRarityToggleButtonGroup, P9RowView } from '../../../../components';
import { usePredicateAttributeGroupFacade } from '../../facades/predicate-attribute-group.facade';
import { P9LogicalOperator, P9StringOperator } from '../../model';

export interface P9MagicCardRarityPredicateBuilderProps {}

export const P9MagicCardRarityPredicateBuilder: FunctionComponent<P9MagicCardRarityPredicateBuilderProps> = () => {
  const [{ selection }, { togglePredicate }] = usePredicateAttributeGroupFacade('rarity');

  const handleToggle = (expression: P9MagicCardRarity) => {
    togglePredicate({
      attribute: 'rarity',
      expression,
      id: v1(),
      logicalOperator: P9LogicalOperator.Or,
      stringOperator: P9StringOperator.Equals,
    });
  };

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
