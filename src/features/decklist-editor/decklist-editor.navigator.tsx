import React, { FunctionComponent } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { P9DecklistEditorHomeScreen } from './decklist-editor-screen/decklist-editor-screen.component';

export type P9DecklistEditorNavigatorParamList = {
  'P9:Modal:DecklistExplorer:Editor:Home': undefined;
  'P9:Modal:DecklistExplorer:Editor:Settings': undefined;
};

const { Navigator, Screen } = createStackNavigator<P9DecklistEditorNavigatorParamList>();

export const P9DecklistEditorNavigator: FunctionComponent = () => {
  return (
    <Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
      <Screen name={'P9:Modal:DecklistExplorer:Editor:Home'} component={P9DecklistEditorHomeScreen} />
    </Navigator>
  );
};
