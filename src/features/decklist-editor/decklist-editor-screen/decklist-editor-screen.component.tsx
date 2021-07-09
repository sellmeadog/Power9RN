import React, { FunctionComponent } from 'react';
import { Header } from 'react-native-elements';
import { Button } from 'react-native-elements/dist/buttons/Button';

import { NavigationProp, RouteProp } from '@react-navigation/native';

import { P9DecklistEditorNavigatorParamList } from '../decklist-editor.navigator';

export interface P9DecklistEditorHomeScreenProps {
  navigation: NavigationProp<P9DecklistEditorNavigatorParamList, 'P9:Modal:DecklistExplorer:Editor:Home'>;
  route: RouteProp<P9DecklistEditorNavigatorParamList, 'P9:Modal:DecklistExplorer:Editor:Entry'>;
}

export const P9DecklistEditorHomeScreen: FunctionComponent<P9DecklistEditorHomeScreenProps> = ({ navigation }) => {
  const { goBack } = navigation;
  // const { name } = useDecklistAttributes('name');

  return (
    <>
      <Header leftComponent={<Button onPress={goBack} icon={{ name: 'arrow-back-ios' }} />} />
    </>
  );
};
