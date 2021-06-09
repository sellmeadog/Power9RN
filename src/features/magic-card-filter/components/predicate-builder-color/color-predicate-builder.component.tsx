import React, { FunctionComponent, useState } from 'react';
import { StyleSheet, Switch } from 'react-native';
import { Text } from 'react-native-elements';

import { P9GameSymbolType, P9ItemSeparator, P9RowView, P9TableDivider } from '../../../../components';
import { useMagicCardColorPredicateBuilder } from '../../state/magic-card-filter.service';
import { P9ColorPredicateFuzzinessToggle } from './color-predicate-toggle-fuzziness.component';
import { P9ColorToggleButton } from './color-toggle-button.component';

export interface P9ColorPredicateBuilderProps {}

export const P9ColorPredicateBuilder: FunctionComponent<P9ColorPredicateBuilderProps> = () => {
  const [colors] = useState<P9GameSymbolType[]>(['W', 'U', 'B', 'R', 'G', 'C']);
  const [predicate, update] = useMagicCardColorPredicateBuilder();

  console.debug('P9ColorPredicateBuilder', predicate);

  const handleEnforceIdentity = (enforceIdentity: boolean) => update({ enforceIdentity });
  const handleFuzziness = (fuzziness: number) => update({ fuzziness });
  const handleToggle = (type: P9GameSymbolType, value: boolean) => update({ [type]: value });

  return (
    <>
      <P9TableDivider title={'Color'} />
      <P9RowView>
        <P9ColorPredicateFuzzinessToggle onChange={handleFuzziness} value={predicate?.expression?.fuzziness} />
        <P9RowView style={[P9ColorPredicateBuilderTheme.pickerContainer]}>
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
      </P9RowView>
      <P9ItemSeparator />
      <P9RowView style={[P9ColorPredicateBuilderTheme.switchContainer]}>
        <Text>Enforce Color Identity</Text>
        <Switch onValueChange={handleEnforceIdentity} value={predicate?.expression?.enforceIdentity} />
      </P9RowView>
    </>
  );
};

const P9ColorPredicateBuilderTheme = StyleSheet.create({
  pickerContainer: {
    justifyContent: 'flex-end',
    paddingRight: 10,
  },

  switchContainer: {
    paddingRight: 10,
  },

  pickerButtonContainer: {
    marginLeft: 5,
  },
});
