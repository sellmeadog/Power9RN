import React, { FunctionComponent } from 'react';
import { KeyboardAvoidingView } from 'react-native';
// import { StyleSheet } from 'react-native';
import { Header, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/core';

import { P9ItemSeparator, P9TableDivider } from '../../../../components';
import { P9StringOperator } from '../../model/predicate';
import { useMagicCardFilterFacade } from '../../state/magic-card-filter.service';
import { P9ColorPredicateBuilder } from '../predicate-builder-color/color-predicate-builder.component';
import { P9GameplayStatPredicateBuilder } from '../predicate-builder-gameplay-stat/predicate-builder-gameplay-stat.component';
import { P9PickerPredicateBuilder } from '../predicate-builder-picker/picker-predicate-builder.component';
import { P9MagicCardRarityPredicateBuilder } from '../predicate-builder-rarity/predicate-builder-rarity.component';
import { P9StringPredicateBuilder } from '../predicate-builder-string/string-predicate-builder.component';

export interface P9MagicCardFilterScreenProps {}

export const P9MagicCardFilterScreen: FunctionComponent<P9MagicCardFilterScreenProps> = () => {
  const { goBack } = useNavigation();
  const [{ canReset, predicate }, reset] = useMagicCardFilterFacade();

  return (
    <>
      <Header
        centerComponent={{ text: 'Advanced Filter' }}
        leftComponent={canReset ? { onPress: reset, text: 'Reset' } : undefined}
        rightComponent={{ onPress: goBack, text: 'Done' }}
      />
      <KeyboardAvoidingView behavior={'height'}>
        <ScrollView keyboardDismissMode={'interactive'} keyboardShouldPersistTaps={'always'}>
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
          <P9ItemSeparator />
          <P9PickerPredicateBuilder
            attribute={'legalities'}
            placeholder={'Formats'}
            navigationParams={{ route: 'P9:Modal:MagicCardFilter:MagicCardTypePicker', title: 'Game Formats' }}
          />
          <P9TableDivider title={'Color'} />
          <P9ColorPredicateBuilder />
          <P9TableDivider title={'Gameplay Stats'} />
          <P9GameplayStatPredicateBuilder />
          <P9TableDivider title={'Printing'} />
          <P9PickerPredicateBuilder
            attribute={'card_faces.artist'}
            placeholder={'Artist'}
            navigationParams={{ route: 'P9:Modal:MagicCardFilter:MagicCardTypePicker', title: 'Artists' }}
          />
          <P9ItemSeparator />
          <P9MagicCardRarityPredicateBuilder />
          <P9ItemSeparator />
          <P9StringPredicateBuilder
            attribute={'card_faces.flavor_text'}
            placeholder={'Flavor Text'}
            stringOperator={P9StringOperator.Contains}
          />
          <P9ItemSeparator />
          <Text>{predicate}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

// const P9MagicCardFilterScreenTheme = StyleSheet.create({});
