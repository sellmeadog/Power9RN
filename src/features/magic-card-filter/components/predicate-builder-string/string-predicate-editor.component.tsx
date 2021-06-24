import React, { FunctionComponent, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';

import { ID } from '@datorama/akita';

import { P9ItemSeparator, P9TextInput } from '../../../../components';
import { P9LogicalOperator, P9Predicate } from '../../model/predicate';
import { P9LogicalOperatorToggle } from '../logical-operator-toggle/logical-operator-toggle';

export interface P9StringPredicateEditorProps {
  id: ID;
  onRemove?(id: ID): void;
  onUpdate?(id: ID, patch: Partial<P9Predicate<string>>): void;
  predicate: P9Predicate<string>;
}

export const P9StringPredicateEditor: FunctionComponent<P9StringPredicateEditorProps> = ({
  id,
  onRemove,
  onUpdate,
  predicate,
}) => {
  const handleChangeLogicalOperator = useCallback(
    (logicalOperator: P9LogicalOperator) => onUpdate?.(id, { logicalOperator }),
    [id, onUpdate],
  );

  const handleChangeText = useCallback((expression: string) => onUpdate?.(id, { expression }), [id, onUpdate]);

  const handleRemove = useCallback(() => onRemove?.(id), [id, onRemove]);

  return (
    <>
      <P9ItemSeparator marginBottom={0} marginTop={0} marginLeft={15} />
      <View style={P9StringPredicateEditorTheme.container}>
        <P9LogicalOperatorToggle onChange={handleChangeLogicalOperator} value={predicate.logicalOperator} />
        <P9TextInput
          onChangeText={handleChangeText}
          style={[P9StringPredicateEditorTheme.textInput]}
          value={predicate.expression}
        />
        <Icon name={'minus-circle-outline'} type={'material-community'} size={15} onPress={handleRemove} />
      </View>
    </>
  );
};

const P9StringPredicateEditorTheme = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 10,
  },

  textInput: {
    flex: 1,
    fontSize: 15,
    height: 34,
  },
});
