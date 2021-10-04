import React, { FunctionComponent } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { P9ComparisonOperator, P9LogicalOperator, P9StringOperator } from '../../model';
import { P9MagicCardFilterScreen } from '../magic-card-filter-screen/magic-card-filter-screen.component';
import { P9PredicatePickerTableScreen } from '../predicate-builder-picker-table-screen/predicate-builder-picker-table-screen.component';

export type P9MagicCardFilterNavigatorParamList = {
  'P9:Modal:MagicCardFilter:Home': {};
  'P9:Modal:MagicCardFilter:PredicatePickerTable': {
    attribute: string;
    comparisonOperator?: P9ComparisonOperator;
    logicalOperator?: P9LogicalOperator;
    stringOperator?: P9StringOperator;
    title: string;
  };
};

const { Navigator, Screen } = createStackNavigator<P9MagicCardFilterNavigatorParamList>();

export interface P9MagicCardFilterNavigatorProps {}

export const P9MagicCardFilterNavigator: FunctionComponent<P9MagicCardFilterNavigatorProps> = () => {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name={'P9:Modal:MagicCardFilter:Home'} component={P9MagicCardFilterScreen} />
      <Screen name={'P9:Modal:MagicCardFilter:PredicatePickerTable'} component={P9PredicatePickerTableScreen} />
    </Navigator>
  );
};
