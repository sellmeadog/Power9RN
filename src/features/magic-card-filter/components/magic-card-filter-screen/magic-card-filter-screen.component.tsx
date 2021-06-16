import React, { FunctionComponent } from 'react';
// import { StyleSheet } from 'react-native';
import { Header, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/core';

import { P9ItemSeparator, P9TableDivider } from '../../../../components';
import { P9StringOperator } from '../../model/predicate';
import { useMagicCardFilterPredicate } from '../../state/magic-card-filter.service';
import { P9ColorPredicateBuilder } from '../predicate-builder-color/color-predicate-builder.component';
import { P9PickerPredicateBuilder } from '../predicate-builder-picker/picker-predicate-builder.component';
import { P9StringPredicateBuilder } from '../predicate-builder-string/string-predicate-builder.component';

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
        <P9TableDivider title={''} />
        <P9StringPredicateBuilder attribute={'card_faces.names'} placeholder={'Card Name'} />
        <P9ItemSeparator />
        <P9StringPredicateBuilder
          attribute={'card_faces.oracle_text'}
          placeholder={'Oracle Text'}
          stringOperator={P9StringOperator.Contains}
        />
        <P9ItemSeparator />
        <P9PickerPredicateBuilder
          attribute={'card_faces.types'}
          placeholder={'Type Line'}
          navigationParams={{ route: 'P9:Modal:MagicCardFilter:MagicCardTypePicker', title: 'Card Types' }}
        />
        <P9TableDivider title={'Color'} />
        <P9ColorPredicateBuilder />
        <P9TableDivider title={'Attributes'} />
        <P9PickerPredicateBuilder
          attribute={'card_faces.artist'}
          placeholder={'Artist'}
          navigationParams={{ route: 'P9:Modal:MagicCardFilter:MagicCardTypePicker', title: 'Artists' }}
        />
        <P9ItemSeparator />
        <Text>{predicate}</Text>
      </ScrollView>
    </>
  );
};

// const P9MagicCardFilterScreenTheme = StyleSheet.create({});
