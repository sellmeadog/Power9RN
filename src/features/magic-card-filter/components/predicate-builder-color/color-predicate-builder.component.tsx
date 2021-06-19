import React, { FunctionComponent } from 'react';
import { Switch } from 'react-native';
import { Text } from 'react-native-elements';

import { P9GameSymbolToggleButtonGroup, P9GameSymbolType, P9ItemSeparator, P9RowView } from '../../../../components';
import { useMagicCardColorPredicateBuilder } from '../../state/magic-card-filter.service';
import { P9ColorPredicateBuilderTheme } from './color-predicate-builder.theme';
import { P9ColorPredicateFuzzinessToggle } from './color-predicate-toggle-fuzziness.component';

export interface P9ColorPredicateBuilderProps {
  symbols?: P9GameSymbolType[];
}

export const P9ColorPredicateBuilder: FunctionComponent<P9ColorPredicateBuilderProps> = ({
  symbols = ['W', 'U', 'B', 'R', 'G', 'C'],
}) => {
  const [expression, update] = useMagicCardColorPredicateBuilder();

  const handleEnforceIdentity = (enforceIdentity: boolean) => update({ enforceIdentity });
  const handleFuzziness = (fuzziness: number) => update({ fuzziness });
  const handleToggle = (type: P9GameSymbolType, value: boolean) =>
    update({ selection: { ...expression?.selection, [type]: value } });

  return (
    <>
      <P9RowView style={[P9ColorPredicateBuilderTheme.container]}>
        <P9ColorPredicateFuzzinessToggle onChange={handleFuzziness} value={expression?.fuzziness} />
        <P9GameSymbolToggleButtonGroup options={symbols} selection={expression?.selection} onToggle={handleToggle} />
      </P9RowView>
      <P9ItemSeparator />
      <P9RowView style={[P9ColorPredicateBuilderTheme.switchContainer]}>
        <Text>Enforce Color Identity</Text>
        <Switch onValueChange={handleEnforceIdentity} value={expression?.enforceIdentity} />
      </P9RowView>
    </>
  );
};
