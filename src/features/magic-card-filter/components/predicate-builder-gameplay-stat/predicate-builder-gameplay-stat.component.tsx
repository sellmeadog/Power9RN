import React, { FunctionComponent, useCallback } from 'react';

import { P9GameSymbolType } from '../../../../components';
import { P9SymbolPickerPredicateBuilder } from '../predicate-builder-picker-symbol/symbol-picker-predicate-builder.component';
import { useGameplayStatPredicateBuilderFacade } from './predicate-builder-gameplay-stat.facade';
import { P9GameplayStatePredicateEditor } from './predicate-builder-gameplay-state-editor.component';

export interface P9GameplayStatPredicateBuilderProps {}

export const P9GameplayStatPredicateBuilder: FunctionComponent<P9GameplayStatPredicateBuilderProps> = () => {
  const [predicates, addPredicate, updatePredicate, removePredicate] = useGameplayStatPredicateBuilderFacade();
  const handleToggle = useCallback(
    (attribute: string, symbol: P9GameSymbolType) => {
      addPredicate(attribute, Number(symbol === 'X' ? '6' : symbol));
    },
    [addPredicate],
  );

  return (
    <>
      <P9SymbolPickerPredicateBuilder
        onSymbolToggle={handleToggle}
        options={[
          { title: 'Mana Value', value: 'cmc' },
          { title: 'Power', value: 'card_faces.power_numeric' },
          { title: 'Toughness', value: 'card_faces.toughness_numeric' },
          { title: 'Loyalty', value: 'card_faces.loyalty_numeric' },
        ]}
        symbols={['0', '1', '2', '3', '4', '5', 'X']}
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
