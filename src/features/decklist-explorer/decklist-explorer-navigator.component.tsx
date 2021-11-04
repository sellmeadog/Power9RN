import React, { FunctionComponent } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { P9DecklistEditorNavigator } from '../decklist-editor/decklist-editor.navigator';
import { P9DecklistExplorerHomeScreen } from './components/decklist-explorer-screen-home/screen-home/screen-home.component';
import { P9UserDecklistExplorerSectionScreen } from './components/decklist-explorer-section-screen/screen-decklist-explorer-section.component';

const { Navigator, Screen } = createStackNavigator<P9DecklistExplorerNavigatorParamList>();

export type P9DecklistExplorerNavigatorParamList = {
  'P9:Modal:DecklistExplorer:Home': undefined;
  'P9:Modal:DecklistExplorer:Section': undefined;
  'P9:Modal:DecklistExplorer:Editor': undefined;
};

export const P9DecklistExplorerNavigator: FunctionComponent = () => {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name={'P9:Modal:DecklistExplorer:Home'} component={P9DecklistExplorerHomeScreen} />
      <Screen name={'P9:Modal:DecklistExplorer:Section'} component={P9UserDecklistExplorerSectionScreen} />
      <Screen name={'P9:Modal:DecklistExplorer:Editor'} component={P9DecklistEditorNavigator} />
    </Navigator>
  );
};
