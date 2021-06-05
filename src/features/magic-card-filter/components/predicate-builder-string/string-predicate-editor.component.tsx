import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';

import { P9ItemSeparator, P9TextInput } from '../../../../components';
import { P9LogicalOperator } from '../../model/predicate';
import { useMagicCardStringPredicateEditor } from '../../state/magic-card-filter.service';
import { P9LogicalOperatorToggle } from '../logical-operator-toggle/logical-operator-toggle';

export interface P9StringPredicateEditorProps {
  id: string;
}

export const P9StringPredicateEditor: FunctionComponent<P9StringPredicateEditorProps> = ({ id }) => {
  const [predicate, update, remove] = useMagicCardStringPredicateEditor(id);

  const handleChangeLogicalOperator = (logicalOperator: P9LogicalOperator) => update({ logicalOperator });
  const handleChangeText = (expression: string) => update({ expression });

  return (
    <>
      <View style={P9StringPredicateEditorTheme.container}>
        <P9LogicalOperatorToggle onChange={handleChangeLogicalOperator} value={predicate?.logicalOperator} />
        <P9TextInput
          onChangeText={handleChangeText}
          style={[P9StringPredicateEditorTheme.textInput]}
          value={predicate?.expression}
        />
        <Icon name={'minus-circle-outline'} type={'material-community'} size={15} onPress={remove} />
      </View>
      <P9ItemSeparator marginBottom={0} marginTop={0} marginLeft={15} />
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
