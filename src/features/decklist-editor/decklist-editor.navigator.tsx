import React, { FunctionComponent } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { P9DecklistEditorHomeScreen } from './decklist-editor-screen/decklist-editor-screen.component';

export type P9DecklistEditorNavigatorParamList = {
  'P9:Modal:DecklistExplorer:Editor:Home': undefined;
  'P9:Modal:DecklistExplorer:Editor:Entry': { entryId: string };
};

const { Navigator, Screen } = createStackNavigator<P9DecklistEditorNavigatorParamList>();

// type P9RouteProp = RouteProp<P9DecklistManagementNavigatorParamList, 'DecklistManagement.Editor'>;

export const P9DecklistEditorNavigator: FunctionComponent = () => {
  return (
    <Navigator mode={'modal'} headerMode={'none'}>
      <Screen name={'P9:Modal:DecklistExplorer:Editor:Home'} component={P9DecklistEditorHomeScreen} />
      {/* <Screen name={'DecklistEditor.Entry'} component={P9DecklistEntryEditorScreen} /> */}
    </Navigator>
  );
};
