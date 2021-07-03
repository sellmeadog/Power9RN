import React, { FunctionComponent, useEffect } from 'react';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { Header } from 'react-native-elements';

import { useNavigation } from '@react-navigation/core';

import {
  P9ItemSeparator,
  P9TableDivider,
  P9TableViewDocumentPickerItem,
  P9TableViewInputItem,
  P9TableViewPickerItem,
} from '../../../../components';
import { useImportDecklistEntries } from '../../../decklist-import/state/use-decklist-entry-import';
import { useCreateDecklistState } from './screen-create.state';

export interface P9CreateDecklistScreenProps {}

export const P9CreateDecklistScreen: FunctionComponent<P9CreateDecklistScreenProps> = () => {
  const { goBack } = useNavigation();
  const [dispatch, { decklistInfo, isValid }] = useCreateDecklistState();
  const [{ importResult }, parseDocumentInfo] = useImportDecklistEntries();

  useEffect(() => {
    if (importResult) {
      dispatch('manualEntries', importResult.manualEntries);
      dispatch('name', importResult.name);
    }
  }, [dispatch, importResult]);

  return (
    <>
      <Header
        leftComponent={{ text: 'Cancel', onPress: goBack }}
        centerComponent={{ text: decklistInfo.name || 'New Decklist' }}
        rightComponent={{ text: 'Create', disabled: !isValid, onPress: goBack }}
      />
      <KeyboardAvoidingView behavior={'padding'}>
        <ScrollView keyboardShouldPersistTaps={'always'}>
          <P9TableDivider />
          <P9TableViewInputItem
            autoCapitalize={'words'}
            autoCorrect={false}
            onChangeText={dispatch.bind(undefined, 'name')}
            placeholder={'Name'}
            value={decklistInfo.name}
          />
          <P9ItemSeparator />
          <P9TableViewPickerItem
            itemPropsExtractor={(gameFormat) => ({ label: gameFormat.name, value: gameFormat.id })}
            items={[
              { id: 'casual', name: 'Casual' },
              { id: 'standard', name: 'Standard' },
              { id: 'historic', name: 'Historic' },
              { id: 'pioneer', name: 'Pioneer' },
              { id: 'modern', name: 'Modern' },
              { id: 'legacy', name: 'Legacy' },
              { id: 'pauper', name: 'Pauper' },
              { id: 'vintage', name: 'Vintage' },
              { id: 'brawl', name: 'Brawl' },
              { id: 'commander', name: 'Commander' },
              { id: 'oathbreaker', name: 'Oathbreaker' },
            ]}
            onValueChange={dispatch.bind(undefined, 'formatId')}
            selectedValue={decklistInfo.formatId}
            title={'Format'}
          />
          <P9TableDivider />
          <P9TableViewDocumentPickerItem onDocumentSelected={parseDocumentInfo} />
          <P9ItemSeparator />
          <P9TableViewInputItem
            multiline
            placeholder={'Already have a decklist? Paste or type it here.'}
            onChangeText={(value) => dispatch('manualEntries', value)}
            value={decklistInfo?.manualEntries}
          />
          <P9TableDivider />
          <P9TableViewInputItem
            multiline
            placeholder={'Quickly describe the theme of your deck, general strategy, and win conditions.'}
            onChangeText={(value) => dispatch('description', value)}
            title={'Description'}
            value={decklistInfo?.description}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};
