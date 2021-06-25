import React, { FunctionComponent, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { P9TextInput } from '../../../../components';
import { usePredicateAttributeGroupFacade } from '../../facades/predicate-attribute-group.facade';
import { P9LogicalOperator, P9StringOperator } from '../../model/predicate';
import { P9PredicateResetButton } from '../predicate-button-reset/predicate-button-reset.component';
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
  const [{ canReset, predicates }, { parseExpression, reset }, { removePredicate, updatePredicate }] =
    usePredicateAttributeGroupFacade<string>(attribute);
  const [expression, setExpression] = useState('');

  const handleBlur = useCallback(() => {
    parseExpression(expression, { logicalOperator, stringOperator });
    setExpression('');
  }, [parseExpression, expression, logicalOperator, stringOperator]);

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
        <P9PredicateResetButton canReset={canReset} onPress={reset} type={'group'} />
      </View>
      {predicates?.map((predicate) => (
        <P9StringPredicateEditor
          id={predicate.id}
          key={predicate.id}
          onRemove={removePredicate}
          onUpdate={updatePredicate}
          predicate={predicate}
        />
      ))}
    </>
  );
};

const P9TextAttributePredicateBuilderTheme = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },

  input: {
    flexGrow: 1,
    fontSize: 17,
  },
});
