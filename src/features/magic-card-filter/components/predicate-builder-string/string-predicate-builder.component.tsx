import React, { FunctionComponent, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';

import { P9TextInput } from '../../../../components';
import { P9StringOperator } from '../../model/predicate';
import { useMagicCardStringPredicateBuilder } from '../../state/magic-card-filter.service';
import { P9StringPredicateEditor } from './string-predicate-editor.component';

export interface P9TextAttributePredicateBuilderProps {
  attribute: string;
  placeholder: string;
  stringOperator?: P9StringOperator;
}

export const P9TextAttributePredicateBuilder: FunctionComponent<P9TextAttributePredicateBuilderProps> = ({
  attribute,
  placeholder,
  stringOperator = P9StringOperator.BeginsWith,
}) => {
  const [predicates, parseExpression, reset] = useMagicCardStringPredicateBuilder(attribute);
  const [expression, setExpression] = useState('');

  const handleBlur = useCallback(() => {
    parseExpression(expression, stringOperator);
    setExpression('');
  }, [parseExpression, expression, stringOperator]);

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
        {Boolean(predicates?.length) && (
          <Icon name={'minus-circle-multiple-outline'} onPress={reset} type={'material-community'} size={15} />
        )}
      </View>
      {predicates?.map(({ id }, index) => (
        <P9StringPredicateEditor key={index} id={id} />
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
