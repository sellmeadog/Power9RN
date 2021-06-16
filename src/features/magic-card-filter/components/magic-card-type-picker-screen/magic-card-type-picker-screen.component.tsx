import React, { FunctionComponent, useCallback, useEffect } from 'react';

import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';

import { P9PickerTableScreenTemplate } from '../../../../components';
import { P9PickerTableSelectionChange } from '../../../../components/picker-table/picker-table-item';
import { P9LogicalOperator } from '../../model/predicate';
import { useArtistCatalog } from '../../state/scryfall-catalog/scryfall-catalog.service';
import { P9MagicCardFilterNavigatorParamList } from '../magic-card-filter-navigator/magic-card-filter-navigator.component';
import { usePickerPredicateBuilder } from '../predicate-builder-picker/picker-predicate.facade';

export interface P9MagicCardArtistPickerScreenProps {
  navigation: StackNavigationProp<P9MagicCardFilterNavigatorParamList, 'P9:Modal:MagicCardFilter:MagicCardTypePicker'>;
  route: RouteProp<P9MagicCardFilterNavigatorParamList, 'P9:Modal:MagicCardFilter:MagicCardTypePicker'>;
}

export const P9MagicCardArtistPickerScreen: FunctionComponent<P9MagicCardArtistPickerScreenProps> = ({ route }) => {
  const { attribute, title } = route.params;
  const [catalog, expression, setExpression] = useArtistCatalog();
  const [selection, canReset, toggle, handleReset] = usePickerPredicateBuilder(attribute);

  const handleSelection = useCallback(
    (change: P9PickerTableSelectionChange) => {
      toggle({
        attribute,
        id: change.value,
        logicalOperator: P9LogicalOperator.Or,
        expression: change,
      });
    },
    [attribute, toggle],
  );

  useEffect(() => {
    return () => {
      setExpression('');
    };
  }, [setExpression]);

  return (
    <P9PickerTableScreenTemplate
      canReset={canReset}
      expression={expression}
      onExpressionChange={setExpression}
      onReset={handleReset}
      onSelection={handleSelection}
      options={catalog || []}
      selection={selection}
      title={title}
    />
  );
};
