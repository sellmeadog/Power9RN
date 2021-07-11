import React, { FC, FunctionComponent, useCallback } from 'react';
import { View } from 'react-native';
import { Header } from 'react-native-elements';
import { Button } from 'react-native-elements/dist/buttons/Button';

import BottomSheet, { BottomSheetBackgroundProps, BottomSheetTextInput, useBottomSheet } from '@gorhom/bottom-sheet';
import { NavigationProp, RouteProp } from '@react-navigation/native';

import { P9SearchBar, P9SearchBox, P9TextInput } from '../../../components';
import { P9DecklistEntryType } from '../../../core/data-user';
import { usePower9Theme } from '../../../core/theme';
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
      <BottomSheet index={0} keyboardBehavior={'interactive'} snapPoints={[76, 250]} backdropComponent={Background}>
        <P9MagicCardSearchBar entryType={activeEntryType} />
      </BottomSheet>
    </>
  );
};

const P9MagicCardSearchBar: FC<{ entryType: P9DecklistEntryType }> = ({ entryType }) => {
  return (
    <View>
      <P9SearchBox InputComponent={BottomSheetTextInput} placeholder={`Add cards to ${entryType}`} />
    </View>
  );
};

const Background: FC<BottomSheetBackgroundProps> = () => {
  const [{ colors }] = usePower9Theme();
  return <View style={{ backgroundColor: 'red' }} />;
};
