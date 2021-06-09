import React, { FunctionComponent } from 'react';
// import { StyleSheet } from 'react-native';
import { Header, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/core';

import { P9ItemSeparator } from '../../../../components';
import { P9StringOperator } from '../../model/predicate';
import { useMagicCardFilterPredicate } from '../../state/magic-card-filter.service';
import { P9ColorPredicateBuilder } from '../predicate-builder-color/color-predicate-builder.component';
import { P9TextAttributePredicateBuilder } from '../predicate-builder-string/string-predicate-builder.component';

export interface P9MagicCardFilterScreenProps {}

export const P9MagicCardFilterScreen: FunctionComponent<P9MagicCardFilterScreenProps> = () => {
  const { goBack } = useNavigation();
  const [predicate, reset] = useMagicCardFilterPredicate();

  return (
    <>
      <Header
        centerComponent={{ text: 'Advanced Filter' }}
        leftComponent={predicate ? { onPress: reset, text: 'Reset' } : undefined}
        rightComponent={{ onPress: goBack, text: 'Done' }}
      />
      <ScrollView>
        <P9TextAttributePredicateBuilder attribute={'card_faces.names'} placeholder={'Card Name'} />
        <P9ItemSeparator />
        <P9TextAttributePredicateBuilder
          attribute={'card_faces.oracle_text'}
          placeholder={'Oracle Text'}
          stringOperator={P9StringOperator.Contains}
        />
        <P9ColorPredicateBuilder />
        <Text>{predicate}</Text>
      </ScrollView>
    </>
  );
};

// const P9MagicCardFilterScreenTheme = StyleSheet.create({});
