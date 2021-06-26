import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';

import { ID } from '@datorama/akita';

import { P9ItemSeparator } from '../../../../components';
import { P9LogicalOperator, P9Predicate } from '../../model';
import { P9LogicalOperatorToggle } from '../logical-operator-toggle/logical-operator-toggle';
import { P9PredicateResetButton } from '../predicate-button-reset/predicate-button-reset.component';

export interface P9PickerPredicateEditorProps {
  id: ID;
  onLogicalOperatorToggle(id: ID, logicalOperator: P9LogicalOperator): void;
  onRemove(id: ID): void;
  predicate: P9Predicate<string>;
}

export const P9PickerPredicateEditor: FunctionComponent<P9PickerPredicateEditorProps> = ({
  id,
  onLogicalOperatorToggle,
  predicate,
  onRemove,
}) => {
  const handleChangeLogicalOperator = (logicalOperator: P9LogicalOperator) =>
    onLogicalOperatorToggle?.(id, logicalOperator);

  const handleRemove = () => onRemove?.(id);

  return (
    <>
      <P9ItemSeparator marginLeft={15} />
      <View style={P9PickerPredicateEditorTheme.container}>
        <P9LogicalOperatorToggle onChange={handleChangeLogicalOperator} value={predicate.logicalOperator} />
        <Text style={[P9PickerPredicateEditorTheme.title]}>{predicate.expression}</Text>
        <P9PredicateResetButton onPress={handleRemove} />
      </View>
    </>
  );
};

const P9PickerPredicateEditorTheme = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    height: 44,
  },

  title: {
    flex: 1,
    fontSize: 17,
  },
});
