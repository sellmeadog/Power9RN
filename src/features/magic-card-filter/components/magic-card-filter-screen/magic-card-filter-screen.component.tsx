import React, { FunctionComponent } from 'react';
// import { StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/core';

import { P9TextAttributePredicateBuilder } from '../predicate-builder-text/text-attribute-predicate-builder';

export interface P9MagicCardFilterScreenProps {}

export const P9MagicCardFilterScreen: FunctionComponent<P9MagicCardFilterScreenProps> = () => {
  const { goBack } = useNavigation();

  return (
    <>
      <Header centerComponent={{ text: 'Advanced Filter' }} rightComponent={{ onPress: goBack, text: 'Done' }} />
      <ScrollView>
        <P9TextAttributePredicateBuilder attribute={'card_faces.names'} placeholder={'Card Name'} />
      </ScrollView>
    </>
  );
};

// const P9MagicCardFilterScreenTheme = StyleSheet.create({});
