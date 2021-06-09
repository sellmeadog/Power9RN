import React, { FunctionComponent, useState } from 'react';
import { Switch } from 'react-native';
import { Text } from 'react-native-elements';

import { P9GameSymbolType, P9ItemSeparator, P9RowView, P9TableDivider } from '../../../../components';
import { useMagicCardColorPredicateBuilder } from '../../state/magic-card-filter.service';
import { P9ColorPredicateBuilderTheme } from './color-predicate-builder.theme';
import { P9ColorPredicateFuzzinessToggle } from './color-predicate-toggle-fuzziness.component';
import { P9ColorPredicateSymbolToggleGroup } from './color-predicate-toggle-symbol.component';

export interface P9ColorPredicateBuilderProps {}

export const P9ColorPredicateBuilder: FunctionComponent<P9ColorPredicateBuilderProps> = () => {
  const [colors] = useState<P9GameSymbolType[]>(['W', 'U', 'B', 'R', 'G', 'C']);
  const [predicate, update] = useMagicCardColorPredicateBuilder();

  const handleEnforceIdentity = (enforceIdentity: boolean) => update({ enforceIdentity });
  const handleFuzziness = (fuzziness: number) => update({ fuzziness });
  const handleToggle = (type: P9GameSymbolType, value: boolean) => update({ [type]: value });

  return (
    <>
      <P9TableDivider title={'Color'} />
      <P9RowView>
        <P9ColorPredicateFuzzinessToggle onChange={handleFuzziness} value={predicate?.expression?.fuzziness} />
        <P9ColorPredicateSymbolToggleGroup
          symbols={colors}
          expression={predicate?.expression}
          onToggle={handleToggle}
        />
      </P9RowView>
      <P9ItemSeparator />
      <P9RowView style={[P9ColorPredicateBuilderTheme.switchContainer]}>
        <Text>Enforce Color Identity</Text>
        <Switch onValueChange={handleEnforceIdentity} value={predicate?.expression?.enforceIdentity} />
      </P9RowView>
    </>
  );
};
