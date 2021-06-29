import React, { FunctionComponent } from 'react';
import { Text } from 'react-native-elements';

import { usePower9Theme } from '../../core/theme';
import { P9ListItem } from './list-item';
import { P9ListTheme } from './list.theme';

export interface P9EmptyListItemProps {
  message: string;
}

export const P9EmptyListItem: FunctionComponent<P9EmptyListItemProps> = ({ message }) => {
  const [{ colors }] = usePower9Theme();

  return (
    <P9ListItem>
      <Text style={[P9ListTheme.emptyItemText, { color: colors?.grey4 }]}>{message}</Text>
    </P9ListItem>
  );
};
