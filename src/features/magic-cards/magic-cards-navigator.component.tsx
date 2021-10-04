import React, { FunctionComponent } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { P9MagicCardDetailScreen } from '../magic-card-detail';
import { P9MagicCardGalleryScreen } from './components/magic-card-gallery-screen/magic-card-gallery-screen.component';

export type P9MagicCardFeatureNavigatorParamList = {
  'P9:Modal:MagicCardFeature:Home': {};
  'P9:Modal:MagicCardFeature:Detail': {};
};

const { Navigator, Screen } = createStackNavigator<P9MagicCardFeatureNavigatorParamList>();

export interface P9MagicCardFeatureNavigatorProps {}

export const P9MagicCardFeatureNavigator: FunctionComponent<P9MagicCardFeatureNavigatorProps> = () => {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name={'P9:Modal:MagicCardFeature:Home'} component={P9MagicCardGalleryScreen} />
      <Screen name={'P9:Modal:MagicCardFeature:Detail'} component={P9MagicCardDetailScreen} />
    </Navigator>
  );
};
