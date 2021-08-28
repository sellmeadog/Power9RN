import React, { PropsWithChildren } from 'react';
import { FlatList, FlatListProps } from 'react-native';

export function P9FlatList<T>({
  keyboardDismissMode = 'interactive',
  keyboardShouldPersistTaps = 'always',
  ...rest
}: PropsWithChildren<FlatListProps<T>>) {
  return (
    <FlatList<T>
      keyboardDismissMode={keyboardDismissMode}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      {...rest}
    />
  );
}
