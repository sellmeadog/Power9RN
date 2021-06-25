import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-elements';

import { ID } from '@datorama/akita';

import { P9ItemSeparator } from '../../../../components';
import { P9LogicalOperator, P9Predicate } from '../../model/predicate';
import { P9LogicalOperatorToggle } from '../logical-operator-toggle/logical-operator-toggle';

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
        <Icon name={'minus-circle-outline'} type={'material-community'} size={15} onPress={handleRemove} />
      </View>
    </>
  );
};

const P9PickerPredicateEditorTheme = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 10,
    height: 34,
  },

  title: {
    flex: 1,
    fontSize: 15,
  },
});
