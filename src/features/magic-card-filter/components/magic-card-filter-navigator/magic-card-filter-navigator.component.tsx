import React, { FunctionComponent } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { P9MagicCardFilterScreen } from '../magic-card-filter-screen/magic-card-filter-screen.component';
import { P9MagicCardArtistPickerScreen } from '../magic-card-type-picker-screen/magic-card-type-picker-screen.component';

export type P9MagicCardFilterNavigatorParamList = {
  'P9:Modal:MagicCardFilter:Home': {};
  'P9:Modal:MagicCardFilter:MagicCardTypePicker': { attribute: string; title: string };
};

const { Navigator, Screen } = createStackNavigator<P9MagicCardFilterNavigatorParamList>();

export interface P9MagicCardFilterNavigatorProps {}

export const P9MagicCardFilterNavigator: FunctionComponent<P9MagicCardFilterNavigatorProps> = () => {
  return (
    <Navigator headerMode={'none'}>
      <Screen name={'P9:Modal:MagicCardFilter:Home'} component={P9MagicCardFilterScreen} />
      <Screen name={'P9:Modal:MagicCardFilter:MagicCardTypePicker'} component={P9MagicCardArtistPickerScreen} />
    </Navigator>
  );
};
