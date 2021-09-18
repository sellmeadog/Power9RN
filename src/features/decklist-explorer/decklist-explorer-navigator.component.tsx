import React, { FunctionComponent } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { P9DecklistEditorNavigator } from '../decklist-editor/decklist-editor.navigator';
import { P9DecklistExplorerHomeScreen } from './components/decklist-explorer-screen-home/screen-home/screen-home.component';

const { Navigator, Screen } = createStackNavigator<P9DecklistExplorerNavigatorParamList>();

export type P9DecklistExplorerNavigatorParamList = {
  'P9:Modal:DecklistExplorer:Home': {
    /*createDecklistInfo?: P9CreateDecklistInfo*/
  };
  'P9:Modal:DecklistExplorer:Editor': { decklistId: string };
};

export const P9DecklistExplorerNavigator: FunctionComponent = () => {
  return (
    <Navigator headerMode={'none'}>
      <Screen name={'P9:Modal:DecklistExplorer:Home'} component={P9DecklistExplorerHomeScreen} />
      <Screen name={'P9:Modal:DecklistExplorer:Editor'} component={P9DecklistEditorNavigator} />
    </Navigator>
  );
};
