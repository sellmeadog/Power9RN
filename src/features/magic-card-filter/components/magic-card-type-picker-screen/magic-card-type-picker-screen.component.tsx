import React, { FunctionComponent, useCallback, useEffect } from 'react';

import { P9PickerTableScreenTemplate } from '../../../../components';
import { P9PickerTableSelectionChange } from '../../../../components/picker-table/picker-table-item';
import { P9LogicalOperator } from '../../model/predicate';
import { useArtistCatalog } from '../../state/scryfall-catalog/scryfall-catalog.service';
import { usePickerPredicateBuilder } from '../predicate-builder-picker/predicate-builder-picker.facade';

export interface P9MagicCardArtistPickerScreenProps {}

export const P9MagicCardArtistPickerScreen: FunctionComponent<P9MagicCardArtistPickerScreenProps> = () => {
  const [catalog, expression, setExpression] = useArtistCatalog();
  const [predicate, update, handleReset] = usePickerPredicateBuilder('card_faces.artist');

  const handleSelection = useCallback(
    (change: P9PickerTableSelectionChange) => {
      update({
        [change.value]: {
          attribute: 'card_faces.artist',
          id: change.value,
          logicalOperator: P9LogicalOperator.Or,
          expression: change,
        },
      });
    },
    [update],
  );

  useEffect(() => {
    return () => {
      setExpression('');
    };
  }, [setExpression]);

  return (
    <P9PickerTableScreenTemplate
      canReset={Boolean(predicate?.expression)}
      expression={expression}
      onExpressionChange={setExpression}
      onReset={handleReset}
      onSelection={handleSelection}
      options={catalog || []}
      selection={predicate?.expression}
      title={'Artists'}
    />
  );
};
