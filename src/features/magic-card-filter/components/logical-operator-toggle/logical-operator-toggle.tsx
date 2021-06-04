import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

export enum P9LogicalOperator {
  And = 'AND',
  Or = 'OR',
  Not = 'AND NOT',
}

export interface P9LogicalOperatorToggleProps {
  value: P9LogicalOperator | undefined;
  onChange(value: P9LogicalOperator): void;
}

export const P9LogicalOperatorToggle: FunctionComponent<P9LogicalOperatorToggleProps> = ({ onChange, value }) => {
  const handlePress = () =>
    onChange(
      value === P9LogicalOperator.And
        ? P9LogicalOperator.Or
        : value === P9LogicalOperator.Or
        ? P9LogicalOperator.Not
        : P9LogicalOperator.And,
    );

  return (
    <Button
      type={'clear'}
      onPress={handlePress}
      title={value?.toLowerCase()}
      buttonStyle={P9LogicalOperatorToggleTheme.button}
      titleStyle={P9LogicalOperatorToggleTheme.title}
    />
  );
};

const P9LogicalOperatorToggleTheme = StyleSheet.create({
  button: {
    paddingVertical: 0,
  },

  title: {
    fontSize: 15,
  },
});
