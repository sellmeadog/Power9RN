import React, { FunctionComponent } from 'react';
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
import { useCreateDecklistFacade } from './screen-create.facade';

export interface P9CreateDecklistScreenProps {}

export const P9CreateDecklistScreen: FunctionComponent<P9CreateDecklistScreenProps> = () => {
  const { goBack } = useNavigation();
  const [{ decklistInfo, isValid }, dispatch, parseDocumentInfo] = useCreateDecklistFacade();

  return (
    <>
      <Header
        leftComponent={{
          text: 'Cancel',
          onPress: () => {
            goBack();
          },
        }}
        centerComponent={{ text: decklistInfo.name || 'New Decklist' }}
        rightComponent={isValid ? { text: 'Create', onPress: goBack } : undefined}
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
            placeholder={'Already have a decklist? Import, paste or type it here.'}
            onChangeText={dispatch.bind(undefined, 'manualEntries')}
            value={decklistInfo.manualEntries}
          />
          <P9TableDivider />
          <P9TableViewInputItem
            multiline
            placeholder={'Quickly describe the theme of your deck, general strategy, and win conditions.'}
            onChangeText={dispatch.bind(undefined, 'description')}
            title={'Description'}
            value={decklistInfo.description}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};
