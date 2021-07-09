import React, { FunctionComponent, useCallback } from 'react';
import { Header } from 'react-native-elements';
import { Button } from 'react-native-elements/dist/buttons/Button';

import { NavigationProp, RouteProp } from '@react-navigation/native';

import { P9DecklistEntryType } from '../../../core/data-user';
import { P9DecklistEditorTabView } from '../decklist-editor-tab-view/decklist-editor-tab-view.component';
import { P9DecklistEditorNavigatorParamList } from '../decklist-editor.navigator';
import { useDecklistEditorFacade } from '../state/decklist-editor.service';

export interface P9DecklistEditorHomeScreenProps {
  navigation: NavigationProp<P9DecklistEditorNavigatorParamList, 'P9:Modal:DecklistExplorer:Editor:Home'>;
  route: RouteProp<P9DecklistEditorNavigatorParamList, 'P9:Modal:DecklistExplorer:Editor:Entry'>;
}

export const P9DecklistEditorHomeScreen: FunctionComponent<P9DecklistEditorHomeScreenProps> = ({ navigation }) => {
  const [{ activeEntryType = 'maindeck', name }, updateFn] = useDecklistEditorFacade();
  const { goBack } = navigation;

  const handleActiveEntryTypeChange = useCallback(
    (value: P9DecklistEntryType) => updateFn('activeEntryType', value),
    [updateFn],
  );

  return (
    <>
      <Header
        leftComponent={<Button onPress={goBack} icon={{ name: 'arrow-back-ios' }} />}
        centerComponent={{ text: name }}
      />
      <P9DecklistEditorTabView
        activeEntryType={activeEntryType}
        onActiveEntryTypeChange={handleActiveEntryTypeChange}
      />
    </>
  );
};
