import React, { FunctionComponent, useCallback, useState } from 'react';
import { v1 } from 'uuid';

import { P9GameSymbolType } from '../../../../components';
import { usePredicateAttributeGroupFacade } from '../../facades/predicate-attribute-group.facade';
import { P9ComparisonOperator, P9LogicalOperator } from '../../model/predicate';
import { P9SymbolPickerPredicateBuilder } from '../predicate-builder-picker-symbol/symbol-picker-predicate-builder.component';
import { P9GameplayStatePredicateEditor } from './predicate-builder-gameplay-state-editor.component';

const GAMEPLAY_STAT_ATTRIBUTES = [
  'cmc',
  'card_faces.power_numeric',
  'card_faces.toughness_numeric',
  'card_faces.loyalty_numeric',
];

const GAMEPLAY_STAT_TITLES = ['Mana Value', 'Power', 'Toughness', 'Loyalty'];

const GAMEPLAY_STATE_OPTIONS = GAMEPLAY_STAT_ATTRIBUTES.map((value, index) => ({
  title: GAMEPLAY_STAT_TITLES[index],
  value,
}));

const GAMEPLAY_STAT_SYMBOLS: P9GameSymbolType[] = ['0', '1', '2', '3', '4', '5', 'X'];

export interface P9GameplayStatPredicateBuilderProps {}

export const P9GameplayStatPredicateBuilder: FunctionComponent<P9GameplayStatPredicateBuilderProps> = () => {
  const [attribute, setAttribute] = useState<string>(GAMEPLAY_STAT_ATTRIBUTES[0]);
  const [{ predicates }, { togglePredicate }, { removePredicate, updatePredicate }] =
    usePredicateAttributeGroupFacade(attribute);

  const handleToggle = useCallback(
    (_, symbol: P9GameSymbolType) => {
      const expression = Number(symbol === 'X' ? 5 : symbol);

      togglePredicate({
        attribute,
        comparisonOperator: expression === 6 ? P9ComparisonOperator.GreaterThan : P9ComparisonOperator.Equal,
        expression,
        id: v1(),
        logicalOperator: P9LogicalOperator.Or,
      });
    },
    [attribute, togglePredicate],
  );

  return (
    <>
      <P9SymbolPickerPredicateBuilder
        onOptionToggle={setAttribute}
        onSymbolToggle={handleToggle}
        options={GAMEPLAY_STATE_OPTIONS}
        symbols={GAMEPLAY_STAT_SYMBOLS}
      />
      {predicates.map((predicate) => (
        <P9GameplayStatePredicateEditor
          key={predicate.id}
          predicate={predicate}
          onUpdate={updatePredicate}
          onRemove={removePredicate}
        />
      ))}
    </>
  );
};
