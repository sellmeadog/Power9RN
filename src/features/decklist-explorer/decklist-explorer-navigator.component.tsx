import React, { FunctionComponent } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { P9DecklistExplorerHomeScreen } from './components/decklist-explorer-screen-home/decklist-explorer-screen-home.component';

const { Navigator, Screen } = createStackNavigator<P9DecklistExplorerNavigatorParamList>();

export type P9DecklistExplorerNavigatorParamList = {
  'P9:Modal:DecklistExplorer:Home': {
    /*createDecklistInfo?: P9CreateDecklistInfo*/
  };
  'DecklistManagement.Editor': { decklistId: string };
};

export const P9DecklistExplorerNavigator: FunctionComponent = () => {
  return (
    // <P9DecklistManagementProvider>
    <Navigator headerMode={'none'}>
      <Screen name={'P9:Modal:DecklistExplorer:Home'} component={P9DecklistExplorerHomeScreen} />
      {/* <Screen name={'DecklistManagement.Editor'} component={P9DecklistEditorNavigator} /> */}
    </Navigator>
    // </P9DecklistManagementProvider>
  );
};
