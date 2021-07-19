import React, { FunctionComponent, useCallback, useRef, useState } from 'react';
import { Header } from 'react-native-elements';
import { Button } from 'react-native-elements/dist/buttons/Button';

import { ID } from '@datorama/akita';
import BottomSheet from '@gorhom/bottom-sheet';
import { NavigationProp, RouteProp } from '@react-navigation/native';

import { P9DecklistEntryType } from '../../../core/data-user';
import { P9DecklistEditorTabView } from '../decklist-editor-tab-view/decklist-editor-tab-view.component';
import { P9DecklistEditorNavigatorParamList } from '../decklist-editor.navigator';
import { P9DecklistEntryInspector } from '../decklist-entry-inspector/decklist-entry-inspector.component';
import { useDecklistEditorFacade } from '../state/decklist-editor.service';
import { P9DecklistEditorBottomSheet } from './decklist-editor-bottom-sheet.component';

export interface P9DecklistEditorHomeScreenProps {
  navigation: NavigationProp<P9DecklistEditorNavigatorParamList, 'P9:Modal:DecklistExplorer:Editor:Home'>;
  route: RouteProp<P9DecklistEditorNavigatorParamList, 'P9:Modal:DecklistExplorer:Editor:Entry'>;
}

export const P9DecklistEditorHomeScreen: FunctionComponent<P9DecklistEditorHomeScreenProps> = ({ navigation }) => {
  const [{ activeEntryType = 'maindeck', name, entries }, updateFn] = useDecklistEditorFacade();
  const [activeId, setActiveId] = useState<ID>();
  const { goBack } = navigation;

  const handleActiveEntryTypeChange = useCallback(
    (value: P9DecklistEntryType) => updateFn('activeEntryType', value),
    [updateFn],
  );

  const modalRef = useRef<BottomSheet>(null);

  return (
    <>
      <Header
        leftComponent={<Button onPress={goBack} icon={{ name: 'arrow-back-ios' }} />}
        centerComponent={{ text: name }}
      />
      <P9DecklistEditorTabView
        activeEntryType={activeEntryType}
        onActiveEntryTypeChange={handleActiveEntryTypeChange}
        onPress={(entry) => {
          setActiveId(entry.id);
          modalRef.current?.expand();
        }}
      />
      <P9DecklistEditorBottomSheet />
      <P9DecklistEntryInspector activeId={activeId} entries={entries} ref={modalRef} />
    </>
  );
};
