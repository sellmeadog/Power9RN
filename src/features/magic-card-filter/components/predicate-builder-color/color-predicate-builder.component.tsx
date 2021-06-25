import React, { FunctionComponent } from 'react';
import { Switch } from 'react-native';
import { Text } from 'react-native-elements';

import { P9GameSymbolToggleButtonGroup, P9GameSymbolType, P9ItemSeparator, P9RowView } from '../../../../components';
import { usePredicateAttributeGroupFacade } from '../../facades/predicate-attribute-group.facade';
import { P9ColorPredicateBuilderTheme } from './color-predicate-builder.theme';
import { P9ColorPredicateFuzzinessToggle } from './color-predicate-toggle-fuzziness.component';

export interface P9ColorPredicateBuilderProps {
  symbols?: P9GameSymbolType[];
}

export const P9ColorPredicateBuilder: FunctionComponent<P9ColorPredicateBuilderProps> = ({
  symbols = ['W', 'U', 'B', 'R', 'G', 'C'],
}) => {
  const [{ metadata, selection }, { togglePredicate, update }] =
    usePredicateAttributeGroupFacade<P9GameSymbolType, { enforceIdentity?: boolean; fuzziness?: number }>(
      'card_faces.colors',
    );

  const handleEnforceIdentity = (enforceIdentity: boolean) => update({ metadata: { enforceIdentity } });
  const handleFuzziness = (fuzziness: number) => update({ metadata: { fuzziness } });
  const handleToggle = (type: P9GameSymbolType) =>
    togglePredicate({ id: type, attribute: 'card_faces.colors', expression: type });

  return (
    <>
      <P9RowView style={[P9ColorPredicateBuilderTheme.container]}>
        <P9ColorPredicateFuzzinessToggle onChange={handleFuzziness} value={metadata?.fuzziness} />
        <P9GameSymbolToggleButtonGroup options={symbols} selection={selection} onToggle={handleToggle} />
      </P9RowView>
      <P9ItemSeparator />
      <P9RowView style={[P9ColorPredicateBuilderTheme.switchContainer]}>
        <Text>Enforce Color Identity</Text>
        <Switch onValueChange={handleEnforceIdentity} value={metadata?.enforceIdentity} />
      </P9RowView>
    </>
  );
};
