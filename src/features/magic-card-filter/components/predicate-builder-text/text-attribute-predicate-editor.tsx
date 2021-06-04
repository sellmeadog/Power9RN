import React, { FunctionComponent } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';

import { P9LogicalOperator, P9LogicalOperatorToggle } from '../logical-operator-toggle/logical-operator-toggle';

export interface P9TextAttributePredicateEditorProps {}

export const P9TextAttributePredicateEditor: FunctionComponent<P9TextAttributePredicateEditorProps> = () => {
  return (
    <View style={P9TextAttributePredicateEditorTheme.container}>
      <P9LogicalOperatorToggle onChange={() => {}} value={P9LogicalOperator.And} />
      <TextInput />
      <Button onPress={() => {}} title={'X'} />
    </View>
  );
};

const P9TextAttributePredicateEditorTheme = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
