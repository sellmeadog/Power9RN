import React, { FunctionComponent, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ButtonGroup, Text } from 'react-native-elements';

import { P9GameSymbolType, P9ItemSeparator, P9RowView } from '../../../../components';
import { useMagicCardColorPredicateBuilder } from '../../state/magic-card-filter.service';
import { P9ColorToggleButton } from './color-toggle-button.component';

export interface P9ColorPredicateBuilderProps {}

export const P9ColorPredicateBuilder: FunctionComponent<P9ColorPredicateBuilderProps> = () => {
  const [colors] = useState<P9GameSymbolType[]>(['W', 'U', 'B', 'R', 'G', 'C']);
  const [predicate, update] = useMagicCardColorPredicateBuilder();

  console.debug('P9ColorPredicateBuilder', predicate);

  const handleFuzziness = (fuzziness: number) => update({ fuzziness });
  const handleToggle = (type: P9GameSymbolType, value: boolean) => update({ [type]: value });

  return (
    <>
      <P9RowView style={[P9ColorPredicateBuilderTheme.pickerContainer]}>
        <ButtonGroup
          onPress={handleFuzziness}
          selectedIndex={predicate?.expression?.fuzziness || 0}
          containerStyle={[{ marginLeft: 0, marginRight: 5 }]}
          buttons={['And', 'Or', 'Not']}
        />
        {colors.map((type) => (
          <P9ColorToggleButton
            active={predicate?.expression?.[type]}
            key={type}
            color={type}
            containerStyle={[P9ColorPredicateBuilderTheme.pickerButtonContainer]}
            onToggle={handleToggle}
            value={type}
          />
        ))}
      </P9RowView>
      <P9ItemSeparator />
      <P9RowView>
        <Text>Match</Text>
        <ButtonGroup
          onPress={handleFuzziness}
          selectedIndex={predicate?.expression?.fuzziness || 0}
          buttons={['Exact', 'Include', 'Only']}
        />
      </P9RowView>
    </>
  );
};

const P9ColorPredicateBuilderTheme = StyleSheet.create({
  pickerContainer: {
    justifyContent: 'flex-end',
    paddingRight: 10,
  },

  pickerButtonContainer: {
    marginLeft: 5,
  },
});
