import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

function title(fuzziness = 0) {
  switch (fuzziness) {
    case 0:
      return 'match exactly';
    case 1:
      return 'must include';
    case 2:
      return 'include at most';
    case 3:
      return 'exclude';
  }
}

export interface P9ColorPredicateFuzzinessToggleProps {
  value?: number;
  onChange(value: number): void;
}

export const P9ColorPredicateFuzzinessToggle: FunctionComponent<P9ColorPredicateFuzzinessToggleProps> = ({
  onChange,
  value = 0,
}) => {
  const handlePress = () => {
    onChange(value === 3 ? 0 : ++value);
  };

  return (
    <Button
      type={'clear'}
      onPress={handlePress}
      title={title(value)}
      buttonStyle={P9ColorPredicateFuzzinessToggleTheme.button}
      titleStyle={P9ColorPredicateFuzzinessToggleTheme.title}
    />
  );
};

const P9ColorPredicateFuzzinessToggleTheme = StyleSheet.create({
  button: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },

  title: {
    fontSize: 17,
  },
});
