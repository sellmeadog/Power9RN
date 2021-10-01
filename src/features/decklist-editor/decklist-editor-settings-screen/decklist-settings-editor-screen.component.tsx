import { useObservableState } from 'observable-hooks';
import React, { FunctionComponent, useCallback } from 'react';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { Header } from 'react-native-elements';

import { useNavigation } from '@react-navigation/core';

import { P9ItemSeparator, P9TableDivider, P9TableViewInputItem, P9TableViewPickerItem } from '../../../components';
import { P9UserDecklist } from '../../../core/data-user';
import { useDependency } from '../../../core/di';
import { whenDefined } from '../../../core/operators';
import { UTC_NOW } from '../../../core/utils';
import { P9UserDecklistFeatureQuery, P9UserDecklistFeatureStore } from '../../decklist-explorer/state';
import { P9_GAME_FORMATS } from '../../decklist-explorer/state/decklist-feature.model';
import { P9DecklistEntryArtworkExplorer } from './decklist-entry-artwork-explorer.component';

export interface P9DecklistSettingsEditorProps {}

export const P9DecklistSettingsEditor: FunctionComponent<P9DecklistSettingsEditorProps> = () => {
  const { goBack } = useNavigation();
  const [{ name, description, entries, formatId = 'casual', metadata }, updateFn] = useDecklistSettingsEditorFacade();

  return (
    <>
      <Header
        leftComponent={{
          text: 'Done',
          onPress: () => {
            goBack();
          },
        }}
        centerComponent={{ text: name }}
      />
      <KeyboardAvoidingView behavior={'padding'}>
        <ScrollView keyboardShouldPersistTaps={'always'}>
          <P9TableDivider />
          <P9TableViewInputItem
            autoCapitalize={'words'}
            autoCorrect={false}
            clearButtonMode={'never'}
            onChangeText={(value) => updateFn({ name: value })}
            placeholder={'Name'}
            value={name}
          />
          <P9ItemSeparator />
          <P9TableViewPickerItem
            itemPropsExtractor={(gameFormat) => ({ label: gameFormat.name, value: gameFormat.id })}
            items={P9_GAME_FORMATS}
            onValueChange={(value) => updateFn({ formatId: value.toString() })}
            selectedValue={formatId}
            title={'Format'}
          />
          <P9TableDivider title={'Decklist Artwork'} />
          <P9DecklistEntryArtworkExplorer
            entries={entries}
            onSelected={(patch) => updateFn({ metadata: { ...metadata, ...patch } })}
            selected={metadata?.defaultCardId}
          />
          <P9TableDivider />
          <P9TableViewInputItem
            multiline
            onChangeText={(value) => updateFn({ description: value })}
            placeholder={'Quickly describe the theme of your deck, general strategy, and win conditions.'}
            title={'Description'}
            value={description}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const useDecklistSettingsEditorFacade = (): [
  state: P9UserDecklist,
  updateFn: (patch: Partial<P9UserDecklist>) => void,
] => {
  const query = useDependency(P9UserDecklistFeatureQuery);
  const store = useDependency(P9UserDecklistFeatureStore);

  return [
    useObservableState(query.selectActive().pipe(whenDefined()), {} as P9UserDecklist),
    useCallback(
      (patch: Partial<P9UserDecklist>) => {
        store.updateActive({ ...patch, modifiedOn: UTC_NOW() });
      },
      [store],
    ),
  ];
};
