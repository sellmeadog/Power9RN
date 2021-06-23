import React, { FunctionComponent, useCallback, useEffect } from 'react';

import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';

import { P9PickerTableScreenTemplate } from '../../../../components';
import { P9PickerTableSelectionChange } from '../../../../components/picker-table/picker-table-item';
import { useCatalogFacade } from '../../state/scryfall-catalog/scryfall-catalog.service';
import { P9MagicCardFilterNavigatorParamList } from '../magic-card-filter-navigator/magic-card-filter-navigator.component';
import { usePickerPredicateTableFacade } from '../predicate-builder-picker/picker-predicate-table.facade';

export interface P9PredicatePickerTableScreenProps {
  navigation: StackNavigationProp<P9MagicCardFilterNavigatorParamList, 'P9:Modal:MagicCardFilter:PredicatePickerTable'>;
  route: RouteProp<P9MagicCardFilterNavigatorParamList, 'P9:Modal:MagicCardFilter:PredicatePickerTable'>;
}

export const P9PredicatePickerTableScreen: FunctionComponent<P9PredicatePickerTableScreenProps> = ({ route }) => {
  const { attribute, comparisonOperator, logicalOperator, stringOperator, title } = route.params;
  const [catalogs, expression, setExpression] = useCatalogFacade(attribute);
  const [{ canReset, selection }, toggle, handleReset] = usePickerPredicateTableFacade(attribute);

  const handleSelection = useCallback(
    (change: P9PickerTableSelectionChange) => {
      toggle({
        attribute,
        comparisonOperator,
        expression: change.value,
        id: change.value,
        logicalOperator,
        stringOperator,
      });
    },
    [attribute, comparisonOperator, logicalOperator, stringOperator, toggle],
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
      options={catalogs}
      selection={selection}
      title={title}
    />
  );
};
