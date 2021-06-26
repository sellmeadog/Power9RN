import React, { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { P9ToggleButtonProps } from '../button-toggle/toggle-button';
import { P9RowView } from '../layout/row.component';

export interface P9ToggleButtonGroupProps<T = any> {
  containerStyle?: StyleProp<ViewStyle>;
  onToggle?(value: T, selected: boolean): void;
  options: T[];
  selection?: { [key: string]: boolean };
  ToggleButtonComponent: React.ComponentType<P9ToggleButtonProps<T>>;
}

export function P9ToggleButtonGroup<T extends string = any>({
  containerStyle,
  onToggle,
  options,
  selection,
  ToggleButtonComponent,
}: PropsWithChildren<P9ToggleButtonGroupProps<T>>) {
  return (
    <P9RowView style={[P9ToggleButtonGroupTheme.container, containerStyle]}>
      {options.map((option) => (
        <ToggleButtonComponent
          key={option}
          active={selection?.[option]}
          onToggle={onToggle}
          containerStyle={[P9ToggleButtonGroupTheme.buttonContainer]}
          value={option}
        />
      ))}
    </P9RowView>
  );
}

const P9ToggleButtonGroupTheme = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
  },

  buttonContainer: {
    marginLeft: 5,
  },
});
