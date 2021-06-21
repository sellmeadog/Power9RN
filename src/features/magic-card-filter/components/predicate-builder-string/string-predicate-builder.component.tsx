import React, { FunctionComponent, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';

import { P9TextInput } from '../../../../components';
import { P9LogicalOperator, P9StringOperator } from '../../model/predicate';
import { useStringPredicateBuilderFacade } from './string-predicate-builder.facade';
import { P9StringPredicateEditor } from './string-predicate-editor.component';

export interface P9StringPredicateBuilderProps {
  attribute: string;
  logicalOperator?: P9LogicalOperator;
  placeholder: string;
  stringOperator?: P9StringOperator;
}

export const P9StringPredicateBuilder: FunctionComponent<P9StringPredicateBuilderProps> = ({
  attribute,
  logicalOperator = P9LogicalOperator.And,
  placeholder,
  stringOperator = P9StringOperator.BeginsWith,
}) => {
  const [{ canReset, predicates }, parseExpression, reset] = useStringPredicateBuilderFacade(
    attribute,
    stringOperator,
    logicalOperator,
  );
  const [expression, setExpression] = useState('');

  const handleBlur = useCallback(() => {
    parseExpression(expression);
    setExpression('');
  }, [parseExpression, expression]);

  return (
    <>
      <View style={P9TextAttributePredicateBuilderTheme.container}>
        <P9TextInput
          onBlur={handleBlur}
          onChangeText={setExpression}
          placeholder={placeholder}
          style={[P9TextAttributePredicateBuilderTheme.input]}
          value={expression}
        />
        {canReset && (
          <Icon name={'minus-circle-multiple-outline'} onPress={reset} type={'material-community'} size={15} />
        )}
      </View>
      {predicates?.map((predicate) => (
        <P9StringPredicateEditor key={predicate.id} predicate={predicate} />
      ))}
    </>
  );
};

const P9TextAttributePredicateBuilderTheme = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },

  input: {
    flexGrow: 1,
    fontSize: 17,
  },
});
