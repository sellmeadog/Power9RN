import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Header, HeaderProps } from 'react-native-elements';

import { useNavigation } from '@react-navigation/native';

export interface P9ModalHeaderProps extends HeaderProps {
  cancelButtonTitle?: string;
}

export const P9ModalHeader: FunctionComponent<P9ModalHeaderProps> = ({
  cancelButtonTitle,
  containerStyle,
  leftComponent,
  ...rest
}) => {
  const { goBack } = useNavigation();

  return (
    <Header
      containerStyle={[P9ModalHeaderTheme.container, containerStyle]}
      leftComponent={leftComponent ?? { text: cancelButtonTitle ?? 'Cancel', onPress: goBack }}
      {...rest}
    />
  );
};

const P9ModalHeaderTheme = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    zIndex: 2,
  },
});
