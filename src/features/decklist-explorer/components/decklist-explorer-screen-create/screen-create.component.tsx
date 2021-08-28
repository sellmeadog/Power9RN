import React, { FunctionComponent, useCallback } from 'react';
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
import { P9_GAME_FORMATS } from '../../state/decklist-feature.model';
import { useCreateDecklistFacade } from './screen-create.facade';

export interface P9CreateDecklistScreenProps {}

export const P9CreateDecklistScreen: FunctionComponent<P9CreateDecklistScreenProps> = () => {
  const { goBack } = useNavigation();
  const [{ decklistInfo, isValid }, dispatch, parseDocumentInfo, onCreate] = useCreateDecklistFacade();

  const handleCreate = useCallback(() => {
    onCreate();
    goBack();
  }, [goBack, onCreate]);

  return (
    <>
      <Header
        leftComponent={{
          text: 'Cancel',
          onPress: () => {
            goBack();
          },
        }}
        centerComponent={{ text: decklistInfo?.name || 'New Decklist' }}
        rightComponent={isValid ? { text: 'Create', onPress: handleCreate } : undefined}
      />
      <KeyboardAvoidingView behavior={'padding'}>
        <ScrollView keyboardShouldPersistTaps={'always'}>
          <P9TableDivider />
          <P9TableViewInputItem
            autoCapitalize={'words'}
            autoCorrect={false}
            onChangeText={(value) => dispatch('name', value)}
            placeholder={'Name'}
            value={decklistInfo?.name}
          />
          <P9ItemSeparator />
          <P9TableViewPickerItem
            itemPropsExtractor={(gameFormat) => ({ label: gameFormat.name, value: gameFormat.id })}
            items={P9_GAME_FORMATS}
            onValueChange={(value) => dispatch('formatId', value.toString())}
            selectedValue={decklistInfo?.formatId}
            title={'Format'}
          />
          <P9TableDivider />
          <P9TableViewDocumentPickerItem onDocumentSelected={parseDocumentInfo} />
          <P9ItemSeparator />
          <P9TableViewInputItem
            multiline
            placeholder={'Already have a decklist? Import, paste or type it here.'}
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
